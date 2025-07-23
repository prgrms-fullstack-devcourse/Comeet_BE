import { Repository } from "typeorm";
import Redis from "iovalkey";
import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { LikeMark } from "./model";
import { LikeDTO, TargetDTO } from "./dto";

@Injectable()
export class LikesService implements OnModuleInit, OnModuleDestroy {
    private readonly _logger: Logger = new Logger(LikesService.name);

    constructor(
       @InjectRepository(LikeMark)
       private readonly _likesRepo: Repository<LikeMark>,
       @Inject(Redis)
       private readonly _redis: Redis,
    ) {}

    async onModuleInit(): Promise<void> {

        const map = await this._likesRepo.find({})
            .then(likes => this.groupByTarget(likes))
            .catch(err => { throw err; });

        for (const [k, likes] of map)
            await this._redis.sadd(k, likes.map(l => l.userId));
    }

    async onModuleDestroy(): Promise<void> {
        const keys = await this._redis.keys("post:*:likes");
        await this._redis.del(...keys);
    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async sync(): Promise<void> {
        try {
            const results = await this.inspectDB();

            const ids = results
                .filter(result => result[1])
                .map(result => result[0]);

            await this._likesRepo.delete(ids);
        }
        catch (error) {
            this._logger.error(error); // action for failure should be added later
        }
    }

    async countLikes(tg: TargetDTO): Promise<number> {
        const key = this.makeKey(tg);

        if (!await this._redis.exists(key))
            return 0;

        return this._redis.scard(key);
    }

    async didLikeIt(dto: LikeDTO): Promise<boolean> {
        const { userId, ...tg } = dto;
        const key = this.makeKey(tg);

        if (!await this._redis.exists(key))
            return false;

        return !!await this._redis.sismember(key, userId);
    }

    async updateLike(dto: LikeDTO): Promise<number> {
        const { userId, ...tg } = dto;
        const key = this.makeKey(tg);

        await this._redis.sismember(key, userId)
            ? await this._redis.srem(key, userId)
            : await this._redis.sadd(key, userId);

        return this._redis.scard(key);
    }

    async countAndCheckLike(like: LikeDTO): Promise<[number, boolean]> {
        const nLikes = await this.countLikes(like);
        const likeIt = await this.didLikeIt(like);
        return [nLikes, likeIt];
    }

    async onTargetDeleted(tg: TargetDTO): Promise<void> {
        await this._redis.del(this.makeKey(tg));
    }

    private makeKey(tg: TargetDTO): string {
        const { targetType, targetId } = tg;
        return `${targetType}:${targetId}:likes`;
    }

    private groupByTarget(likes: LikeMark[]): Map<string, LikeMark[]> {
        return Map.groupBy(likes, like => this.makeKey(like));
    }

    private async inspectDB(): Promise<[number, boolean][]> {
        const likes = await this._likesRepo.find();

        return await Promise.all(
            likes.map(async ({ id, ...rest }) => {
                const deleteIt = !await this.didLikeIt(rest);
                return [id, deleteIt];
            })
        );
    }

}