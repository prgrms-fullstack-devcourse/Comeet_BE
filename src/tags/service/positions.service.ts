import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Position } from "../model";
import { Repository } from "typeorm";
import Redis from "iovalkey";
import { pick } from "../../utils/object";
import { TypeDTO } from "../../common";

const __REDIS_KEY = "positions";

@Injectable()
export class PositionsService implements OnModuleInit, OnModuleDestroy {

    constructor(
       @InjectRepository(Position)
       private readonly _positionsRepo: Repository<Position>,
       @Inject(Redis)
       private readonly _redis: Redis
    ) {}

    /**
     * Since positions table is not modified by user input,
     * Caching data to redis during service run for performance
     */
    async onModuleInit(): Promise<void> {
        const positons = await this._positionsRepo.find();

        await this._redis.rpush(
            __REDIS_KEY,
            ...positons.map(p =>
                JSON.stringify(pick(p, ["id", "value"]))
            )
        );
    }

    /**
     * Clear cache on service closed
     */
    async onModuleDestroy(): Promise<void> {
        await this._redis.del(__REDIS_KEY);
    }

    async getAllPositions(): Promise<TypeDTO[]> {
        const raws = await this._redis.lrange(__REDIS_KEY,0, -1);
        return raws.map(raw => JSON.parse(raw));
    }
}