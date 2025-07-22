import { Inject, Injectable } from "@nestjs/common";
import Redis from "iovalkey";
import { plainToInstanceOrReject, TokenPair } from "../utils";

@Injectable()
export class GithubTokensStorage {

    constructor(
       @Inject(Redis)
       private readonly _redis: Redis
    ) {}

    async saveTokenPair(
        githubId: string,
        tokenPair: TokenPair
    ): Promise<void> {
        await this._redis.hset(githubId, tokenPair);
    }

    async getTokenPair(githubId: string): Promise<TokenPair> {
        const pair = await this._redis.hgetall(githubId);
        return await plainToInstanceOrReject(TokenPair, pair);
    }
}