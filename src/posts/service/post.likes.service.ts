import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostLike } from "../model";
import { Repository } from "typeorm";
import Redis from "iovalkey";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class PostLikeService implements OnModuleInit, OnModuleDestroy {
    private readonly _logger: Logger = new Logger(PostLikeService.name);

    constructor(
        @InjectRepository(PostLike)
        private readonly _likesRepo: Repository<PostLike>,
        @Inject(Redis)
        private readonly _redis: Redis,
    ) {}

    async onModuleInit(): Promise<void> {

        const map = await this._likesRepo.find({})
            .then(__groupByPostId)
            .catch(err => { throw err; });

        for (const [k, likes] of map)
            await this._redis.sadd(k, likes.map(l => l.userId));
    }

    async onModuleDestroy(): Promise<void> {
        const keys = await this._redis.keys("post:*:likes");
        await this._redis.del(...keys);
    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async synchronize(): Promise<void> {
        try {
            const likes = await this._likesRepo.find();

            const ids = (await Promise.all(
                likes.map(async ({ id, postId, userId }) => {

                    const deleteIt = !await this._redis.sismember(
                        __makeKey(postId),
                        userId
                    );

                    return { id, deleteIt };
                })
            )).filter(({ deleteIt }) => deleteIt)
                .map(({ id }) => id);

            await this._likesRepo.delete(ids);
        }
        catch (error) {
            this._logger.error(error); // action for failure should be added later
        }
    }

    countPostLikes(postId: number): Promise<number> {
        return this._redis.scard(__makeKey(postId));
    }

    async updatePostLikes(postId: number, userId: number): Promise<number> {
        const key = __makeKey(postId);

        await this._redis.sismember(key, userId)
            ? await this._redis.srem(key, userId)
            : await this._redis.sadd(key, userId);

        return this._redis.scard(key);
    }

    async onPostDeleted(postId: number): Promise<void> {
        await this._redis.del(__makeKey(postId));
    }
}

function __makeKey(postId: number) {
    return `post:${postId}:likes`;
}

function __groupByPostId(likes: PostLike[]): Map<string, PostLike[]> {
    return Map.groupBy(likes, like => __makeKey(like.postId));
}