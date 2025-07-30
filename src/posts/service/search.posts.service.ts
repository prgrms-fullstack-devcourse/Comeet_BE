import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Applicant, Post, Bookmark } from "../model";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { SearchAdjacentPostResult, SearchAdjacentPostsDTO, SearchPostResult, SearchPostsDTO } from "../dto";
import { setSelectClause, WhereClause } from "./service.internal";
import { makeSelectDistanceQuery, makeRadiusConditionQuery, makeSelectCoordinatesQuery } from "../../common/geo";
import { WhereIdInTargetIds } from "../../common/marks";

@Injectable()
export class SearchPostsService {

    constructor(
       @InjectRepository(Post)
       private readonly _postsRepo: Repository<Post>,
    ) {}

    async searchPosts(dto: SearchPostsDTO): Promise<SearchPostResult[]> {
        return this.createSelectQueryBuilder()
            .where(new Brackets(WhereClause(dto)))
            .getRawMany<SearchPostResult>();
    }

    async searchAdjacentPosts(
        dto: SearchAdjacentPostsDTO
    ): Promise<SearchAdjacentPostResult[]> {
        const { origin, radius, ...filters } = dto;

        return this.createSelectQueryBuilder()
            .addSelect(
                makeSelectCoordinatesQuery("post", "location"),
                "location"
            )
            .addSelect(
                makeSelectDistanceQuery("post", "location"),
                "distance"
            )
            .where(new Brackets(WhereClause(filters)))
            .andWhere(makeRadiusConditionQuery("post", "location"))
            .setParameters({ ...origin, radius })
            .orderBy("distance", "ASC")
            .getRawMany<SearchAdjacentPostResult>();
    }

    async searchPostsAppliedTo(userId: number): Promise<SearchPostResult[]> {
        return this.createSelectQueryBuilder()
            .where(WhereIdInTargetIds(Applicant, "post"))
            .setParameters({ userId })
            .getRawMany<SearchPostResult>();
    }

    async searchBookmarkPosts(userId: number): Promise<SearchPostResult[]> {
        return this.createSelectQueryBuilder()
            .where(WhereIdInTargetIds(Bookmark, "post"))
            .setParameters({ userId })
            .getRawMany<SearchPostResult>();
    }

    private createSelectQueryBuilder(): SelectQueryBuilder<Post> {
        return setSelectClause(
            this._postsRepo
                .createQueryBuilder("post")
        );
    }

}




