import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Position } from "../model";
import { Repository } from "typeorm";
import Redis from "iovalkey";
import { TagsServiceBase } from "./tags.service.base";
import { PositionDTO } from "../dto";
import { TypeDTO } from "../../common";

@Injectable()
export class PositionsService extends TagsServiceBase {

    constructor(
       @InjectRepository(Position)
       repo: Repository<Position>,
       @Inject(Redis)
       redis: Redis
    ) {
        super(repo, redis, "positions");
    }

    async getAllPositions(): Promise<PositionDTO[]> {
        const tags = await this.getAllTags();
        return tags.map(PositionsService.toPositionDTO);
    }

    static toPositionDTO(type: TypeDTO): PositionDTO {
        const [field, value] = type.value.split(":");
        return { id: type.id, field, value };
    }
}