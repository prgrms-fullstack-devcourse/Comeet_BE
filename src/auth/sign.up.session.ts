import { Inject, Injectable } from "@nestjs/common";
import Redis from "iovalkey";
import { GithubUserDTO } from "../github/dto";
import * as crypto from "node:crypto";
import { ConfigService } from "@nestjs/config";
import { plainToInstanceOrReject } from "../utils";

@Injectable()
export class SignUpSession {
    private readonly _sessionExp: number;

    constructor(
       @Inject(Redis)
       private readonly _redis: Redis,
       @Inject(ConfigService)
       config: ConfigService,
    ) {
        this._sessionExp = config.get<number>(
            "SIGN_UP_SESSION_EXP",
        ) ?? 300_000;
    }

    async create(data: GithubUserDTO): Promise<string> {
        const id = crypto.randomUUID().replaceAll('-', '');
        const key = __makeKey(id);

        await this._redis.hset(key, data);
        await this._redis.pexpire(key, this._sessionExp);

        return id;
    }

    async get(id: string): Promise<GithubUserDTO | null> {
        const plain = await this._redis.hgetall(__makeKey(id));

        return await plainToInstanceOrReject(GithubUserDTO, plain)
            .catch(err => null);
    }
}

function __makeKey(id: string): string {
    return `session:${id}`;
}