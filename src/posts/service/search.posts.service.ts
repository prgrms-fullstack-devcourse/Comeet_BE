import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Applicant, Post, Bookmark } from "../model";
import { Repository } from "typeorm";
import { SearchPostResult, SearchPostsDTO } from "../dto";
import { setSelectClause, setWhereClause } from "./service.internal";
import { SearchAdjacentPostsDTO } from "../dto/post/search.adjacent.posts.dto";
import { SearchAdjacentPostResult } from "../dto/post/search.adjacent.post.result";
import { setGeometricQuery } from "../../common/geo";
import { createSelectTargetsQueryBuilder } from "../../common/marks";

@Injectable()
export class SearchPostsService {

    constructor(
       @InjectRepository(Post)
       private readonly _postsRepo: Repository<Post>,
       @InjectRepository(Applicant)
       private readonly _applicantsRepo: Repository<Applicant>,
       @InjectRepository(Bookmark)
       private readonly _bookmarksRepo: Repository<Bookmark>,
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

        const qb = createSelectTargetsQueryBuilder(
            this._applicantsRepo,
            "posts", "post",
            userId
        );

        setSelectClause(qb);
        return qb.getRawMany<SearchPostResult>();
    }

    async searchBookmarkPosts(userId: number): Promise<SearchPostResult[]> {

        const qb = createSelectTargetsQueryBuilder(
            this._bookmarksRepo,
            "posts", "post",
            userId
        );

        setSelectClause(qb);
        return qb.getRawMany<SearchPostResult>();
    }




}




