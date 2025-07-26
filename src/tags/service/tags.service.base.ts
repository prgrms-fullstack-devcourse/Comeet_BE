import { Repository } from "typeorm";
import { TypeBase, TypeDTO } from "../../common/data";
import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from "iovalkey";

export abstract class TagsServiceBase implements OnModuleInit, OnModuleDestroy{

    constructor(
        protected readonly _repo: Repository<TypeBase>,
        protected readonly _redis: Redis,
        protected readonly _redisKey: string,
    ) {}

    async onModuleInit(): Promise<void> {
        const tags = await this._repo.find();

        await this._redis.rpush(
            this._redisKey,
            ...tags.map(tag =>
                JSON.stringify(TypeBase.toTypeDTO(tag))
            )
        );
    }

    async onModuleDestroy(): Promise<void> {
        await this._redis.del(this._redisKey);
    }

    protected async getAllTags(): Promise<TypeDTO[]> {
        const raws = await this._redis.lrange(this._redisKey,0, -1);
        return raws.map(raw => JSON.parse(raw));
    }
}