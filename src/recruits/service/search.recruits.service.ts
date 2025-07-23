import { InjectRepository } from "@nestjs/typeorm";
import { Recruit } from "../model";
import { Repository } from "typeorm";
import { SearchRecruitsDTO } from "../dto";

const __RADIUS = 5;

export class SearchRecruitsService {

    constructor(
        @InjectRepository(Recruit)
        private readonly _recruitsRepo: Repository<Recruit>,
    ) {}

    async searchRecruit(dto: SearchRecruitsDTO): Promise<Recruit[]> {
        const { categoryId, userId, keyword, location  } = dto;

        const qb = this._recruitsRepo
            .createQueryBuilder("recruit")
            .select("recruit.*")
            .leftJoinAndSelect("recruit.category", "category")
            .leftJoinAndSelect("recruit.user", "user");

        categoryId && qb.andWhere("recruit.categoryId = :categoryId", { categoryId });
        userId && qb.andWhere("recruit.userId = :userId", { userId });

        keyword && qb.andWhere(
            "recruit.title LIKE :keyword OR recruit.detail LIKE :keyword",
            { keyword: `%${keyword}%` },
        );

        location && qb.andWhere(
            "ST_Distance_Sphere(recruit.location, ST_POINT(:lng, :lat)) <= :radius",
            { lng: location[0], lat: location[1], radius: __RADIUS },
        );

        return await qb.getMany();
    }


}