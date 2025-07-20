import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import Redis from "iovalkey";
import { TokenPair } from "../../utils";

@Injectable()
export class GithubTokensService {

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

        if (!Object.keys(pair).length)
            throw new ForbiddenException();

       return pair as unknown as TokenPair;
    }
}