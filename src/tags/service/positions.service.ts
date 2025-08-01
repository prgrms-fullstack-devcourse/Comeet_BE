import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Position } from "../model";
import { Repository } from "typeorm";
import { PositionDTO } from "../dto";
import { ModelBase } from "../../common/data";

@Injectable()
export class PositionsService {

    constructor(
       @InjectRepository(Position)
       private readonly _positionsRepo: Repository<Position>,
    ) {}

    async getAllPositions(): Promise<PositionDTO[]> {

        const positions = await this._positionsRepo.find({
            cache: true,
        });

        return positions.map(ModelBase.excludeTimestamp);
    }

    async getValue(id: number): Promise<PositionDTO> {
        return this._positionsRepo.findOneOrFail({
            where: { id },
            cache: true,
        }).then(ModelBase.excludeTimestamp)
            .catch(err => { throw err; });
    }
}

