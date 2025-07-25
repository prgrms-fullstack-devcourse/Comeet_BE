import { InjectRepository } from "@nestjs/typeorm";
import { Recruit } from "../../model";
import { Repository } from "typeorm";
import { SearchRecruitsDTO } from "../../dto";

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
            .innerJoinAndSelect("recruit.category", "category")
            .innerJoinAndSelect("recruit.user", "user")
            .innerJoinAndSelect("recruit.common", "common")

        categoryId && qb.andWhere("category.id = :categoryId", { categoryId });
        userId && qb.andWhere("user.id = :userId", { userId });

        keyword && qb.andWhere(
            "common.title LIKE :keyword OR common.detail LIKE :keyword",
            { keyword: `%${keyword}%` },
        );

        location && qb.andWhere(
            "ST_Distance_Sphere(recruit.location, ST_POINT(:lng, :lat)) <= :radius",
            { lng: location[0], lat: location[1], radius: __RADIUS },
        );

        return await qb.getMany();
    }


}