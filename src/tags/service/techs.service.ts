import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tech } from "../model";
import { Like, Repository } from "typeorm";
import { TypeBase, TypeDTO, TypesServiceBase } from "../../common/type";

@Injectable()
export class TechsService extends TypesServiceBase<Tech>{

    constructor(
        @InjectRepository(Tech)
        protected readonly _repo: Repository<Tech>,
    ) { super(); }


    async searchTechs(keyword: string): Promise<TypeDTO[]> {

        const techs = await this._repo.find({
            where: { value: Like(`%${keyword}%`) },
            cache: true,
        });

        return techs.map(TypeBase.toTypeDTO);
    }
}