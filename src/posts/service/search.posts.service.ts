import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Applicant, Post, Bookmark } from "../model";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { SearchAdjacentPostResult, SearchAdjacentPostsDTO, SearchPostResult, SearchPostsDTO } from "../dto";
import { setSelectClause, WhereClause } from "./service.internal";
import { makeSelectDistanceQuery, makeRadiusConditionQuery, makeSelectCoordinatesQuery } from "../../common/geo";
import { MarkBase, WhereIdInTargetIds } from "../../common/marks";
import { plainToInstance } from "class-transformer";
import { Clazz } from "../../utils";

@Injectable()
export class SearchPostsService {

    constructor(
       @InjectRepository(Post)
       private readonly _postsRepo: Repository<Post>,
    ) {}

    async searchPosts(dto: SearchPostsDTO): Promise<SearchPostResult[]> {
        return this.createSelectQueryBuilder()
            .where(new Brackets(WhereClause(dto)))
            .getRawMany()
            .then(raws => __toResults(SearchPostResult, raws))
            .catch(err => { throw err; });
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
                makeSelectDistanceQuery( "post", "location"),
                "distance"
            )
            .where(new Brackets(WhereClause(filters)))
            .andWhere(makeRadiusConditionQuery("post", "location"))
            .setParameters({ ...origin, radius })
            .orderBy("distance", "ASC")
            .getRawMany()
            .then(raws => __toResults(SearchAdjacentPostResult, raws))
            .catch(err => { throw err; });
    }

    async searchPostsAppliedTo(userId: number): Promise<SearchPostResult[]> {
        return this.searchMarkedPosts(Applicant, userId);
    }

    async searchBookmarkPosts(userId: number): Promise<SearchPostResult[]> {
        return this.searchMarkedPosts(Bookmark, userId);
    }

    private createSelectQueryBuilder(): SelectQueryBuilder<Post> {
        return setSelectClause(
            this._postsRepo
                .createQueryBuilder("post")
        );
    }

    private async searchMarkedPosts<M extends MarkBase>(
        cls: Clazz<M>,
        userId: number
    ): Promise<SearchPostResult[]> {
        return this.createSelectQueryBuilder()
            .where(WhereIdInTargetIds(cls, "post"))
            .setParameters({ userId })
            .getRawMany()
            .then(raws => __toResults(SearchPostResult, raws))
            .catch(err => { throw err; });
    }

}

function __toResults<R extends SearchPostResult>(
    cls: Clazz<R>,
    raws: any[]
): R[] {
    return raws.map(r => plainToInstance(cls, r));
}




