import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tech } from "../model";
import { In, Like, Repository } from "typeorm";
import { TypeBase, TypeDTO } from "../../common/data";

@Injectable()
export class TechsService {

    constructor(
        @InjectRepository(Tech)
        private readonly _techsRepo: Repository<Tech>
    ) {}

    async searchTechs(keyword: string): Promise<TypeDTO[]> {

        const techs = await this._techsRepo.find({
            where: { value: Like(`%${keyword}%`) },
            cache: true,
        });

        return techs.map(TypeBase.toTypeDTO);
    }

    async getTechs(ids: number[]): Promise<TypeDTO[]> {

        const techs = await this._techsRepo.find({
            where: { id: In(ids) },
            cache: true,
        });

        return techs.map(TypeBase.toTypeDTO);
    }
}