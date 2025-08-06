import { Inject, Injectable } from "@nestjs/common";
import Redis from "iovalkey";
import { JwtOptions } from "../jwt.options";

@Injectable()
export class BlacklistService {
    private readonly _ex: number;

    constructor(
       @Inject(Redis)
       private readonly _redis: Redis,
       @Inject(JwtOptions)
       { accessExp }: JwtOptions
    ) {
        this._ex = accessExp;
    }

    async add(authorization: string): Promise<void> {
        await this._redis
            .set(
                authorization,
                Date.now(),
                "PX",
                this._ex,
            );
    }

    async exists(authorization: string): Promise<boolean> {
        return !!await this._redis.get(authorization);
    }
}