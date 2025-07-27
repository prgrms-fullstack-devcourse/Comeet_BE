import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Interest } from "../model/interest.model";
import { In, Repository } from "typeorm";
import { TypeBase, TypeDTO } from "../../common/data";

@Injectable()
export class InterestsService {

    constructor(
       @InjectRepository(Interest)
       private readonly _interestsRepo: Repository<Interest>,
    ) {}

    async getAllInterests(): Promise<TypeDTO[]> {

        const interests = await this._interestsRepo.find({
            cache: true,
        });

        return interests.map(TypeBase.toTypeDTO);
    }

    async getValues(ids: number[]): Promise<TypeDTO[]> {

        const interests = await this._interestsRepo.find({
            where: { id: In(ids) },
            cache: true,
        });

        return interests.map(TypeBase.toTypeDTO);
    }

}