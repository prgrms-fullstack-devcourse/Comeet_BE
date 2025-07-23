import { InjectRepository } from "@nestjs/typeorm";
import { Recruit } from "../model";
import { Repository } from "typeorm";
import { SearchRecruitResult, SearchRecruitsDTO } from "../dto";
import { Inject } from "@nestjs/common";
import { LikesService } from "../../likes";
import { makeTarget } from "./service.internal";
import { pick } from "../../utils/object";

const __RADIUS = 5;

export class SearchRecruitsService {

    constructor(
        @InjectRepository(Recruit)
        private readonly _recruitsRepo: Repository<Recruit>,
        @Inject(LikesService)
        private readonly _likesService: LikesService,
    ) {}

    async searchRecruit(dto: SearchRecruitsDTO): Promise<SearchRecruitResult[]> {
        const { categoryId, userId, keyword, location  } = dto;

        const qb = this._recruitsRepo
            .createQueryBuilder("recruit")
            .select("recruit.*")
            .leftJoinAndSelect("recruits.category", "category")
            .leftJoinAndSelect("recruits.user", "user");

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

        const recruits = await qb.getMany();

        return Promise.all(
            recruits.map(async recruit =>
                this.toSearchRecruitResult(recruit)
            )
        );
    }

    private async toSearchRecruitResult(recruit: Recruit): Promise<SearchRecruitResult> {
        const category = recruit.category.value;
        const author = recruit.user.nickname;
        const nLikes = await this._likesService.countLikes(makeTarget(recruit.id));

        return {
            ...pick(recruit, ["id", "title", "location", "createdAt"]),
            category, author, nLikes
        };
    }
}