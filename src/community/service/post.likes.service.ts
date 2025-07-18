import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostLike } from "../model";
import { Repository } from "typeorm";
import Redis from "iovalkey";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class PostLikesService implements OnModuleInit {

    constructor(
       @InjectRepository(PostLike)
       private readonly _likesRepos: Repository<PostLike>,
       @Inject(Redis)
       private readonly _redis: Redis,
    ) {}

    async onModuleInit(): Promise<void> {
        const postLikes = await this._likesRepos.find();

        for (const { postId, userId } of postLikes) {
            await this._redis.sadd(
                __makeKey(postId),
                userId
            );
        }
    }

    @Cron(CronExpression.EVERY_4_HOURS)
    async synchronize(): Promise<void> {

    }

    countPostLikes(postId: number): Promise<number> {
        return this._redis.scard(__makeKey(postId));
    }

    likedIt(postId: number, userId: number): Promise<boolean> {
        return this._redis.sismember(
            __makeKey(postId), userId
        ).then(Boolean).catch(err => { throw err; });
    }

    async updateLike(postId: number, userId: number): Promise<number> {
        const key = __makeKey(postId);
        const likedIt = await this._redis.sismember(key, userId);

        likedIt
            ? await this._redis.srem(key, userId)
            : await this._redis.sadd(key, userId);

        return this._redis.scard(key);
    }

}

function __makeKey(postId: number): string {
    return `post:${postId}:likes`;
}