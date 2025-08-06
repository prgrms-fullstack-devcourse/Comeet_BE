import { Inject, Injectable } from "@nestjs/common";
import Redis from "iovalkey";
import { GithubUserDTO } from "../../github/dto";
import { randomUUID } from "node:crypto";
import { ConfigService } from "@nestjs/config";
import { plainToInstanceOrReject } from "../../utils";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class SignUpSessionService {
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
        const id = randomUUID().replaceAll('-', '');
        const key = __makeKey(id);
        await this._redis.hset(key, instanceToPlain(data));
        await this._redis.pexpire(key, this._sessionExp);
        return id;
    }

    async get(id: string): Promise<GithubUserDTO | null> {
        const plain = await this._redis.hgetall(__makeKey(id));

        return await plainToInstanceOrReject(GithubUserDTO, plain)
            .catch(_ => null);
    }
}

function __makeKey(id: string): string {
    return `session:${id}`;
}