import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "../model";
import { Repository } from "typeorm";
import Redis from "iovalkey";

@Injectable()
export class CommentsCountService {

    constructor(
        @InjectRepository(Comment)
        private readonly _commentsRepo: Repository<Comment>,
        @Inject(Redis)
        private readonly _redis: Redis,
    ) {}

    async countComments(postId: number): Promise<number> {
        const key = await this.loadCountIfNotExists(postId);

        return this._redis.get(key)
            .then(Number)
            .catch(err => { throw err; });
    }

    async updateCount(postId: number, delta: number): Promise<void> {
        const key = await this.loadCountIfNotExists(postId);

        const count = await this._redis.get(key)
            .then(Number)
            .catch(err => { throw err; });

        await this._redis.incrby(
            key,
            Math.max(-count, delta)
        );
    }

    private async loadCountIfNotExists(postId: number): Promise<string> {
        const key = __makeKey(postId);

        if (!await this._redis.exists(key)) {
            const count = await this._commentsRepo.countBy({ postId });
            await this._redis.set(key, count);
        }

        return key;
    }
}

function __makeKey(postId: number): string {
    return `post:${postId}:comments`;
}
