import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Applicant, Post, Bookmark } from "../model";
import { Repository, SelectQueryBuilder } from "typeorm";
import { SearchAdjacentPostResult, SearchAdjacentPostsDTO, SearchPostResult, SearchPostsDTO } from "../dto";
import { setSelectClause, setWhereClause } from "./service.internal";
import { setGeometricQuery } from "../../common/geo";
import { MarkBase, WhereIdInTargetIds } from "../../common/marks";

@Injectable()
export class SearchPostsService {

    constructor(
       @InjectRepository(Post)
       private readonly _postsRepo: Repository<Post>,
    ) {}

    async searchPosts(dto: SearchPostsDTO): Promise<SearchPostResult[]> {
        const qb = this._postsRepo.createQueryBuilder("post");

        setSelectClause(qb);
        setWhereClause(qb, dto);

        return qb.getRawMany<SearchPostResult>();
    }

    async searchAdjacentPosts(
        dto: SearchAdjacentPostsDTO
    ): Promise<SearchAdjacentPostResult[]> {
        const { origin, radius, ...filters } = dto;

        const qb = this._postsRepo
            .createQueryBuilder("post")
            .select(
                "jsonb_build_object('lat', ST_Y(post.location), 'lng', ST_X(post.location))",
                "location"
            );

        setSelectClause(qb);
        setWhereClause(qb, filters);
        setGeometricQuery(qb, "post.location", origin, radius);

        return qb.getRawMany<SearchAdjacentPostResult>();
    }

    async searchPostsAppliedTo(userId: number): Promise<SearchPostResult[]> {
        return this.searchMarked(Applicant, userId);
    }

    async searchBookmarkPosts(userId: number): Promise<SearchPostResult[]> {
        return this.searchMarked(Bookmark, userId);
    }

    private createSelectQueryBuilder(): SelectQueryBuilder<Post> {
        const qb = this._postsRepo.createQueryBuilder("post");
        setSelectClause(qb);
        return qb;
    }

    private async searchMarked<M extends MarkBase>(
        cls: { new (...args: any[]): M },
        userId: number
    ): Promise<SearchPostResult[]> {
        return this.createSelectQueryBuilder()
            .where(
                WhereIdInTargetIds(cls, "post"),
                { userId }
            ).getRawMany<SearchPostResult>();
    }

}




