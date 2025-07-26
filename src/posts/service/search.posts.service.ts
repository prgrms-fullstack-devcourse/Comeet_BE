import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Applicant, GeoPostPointer, Post } from "../model";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { SearchPostResult, SearchPostsDTO } from "../dto";
import { ModelDTOTransformerService } from "./model.dto.transformer.service";
import { Coordinates } from "../../utils";
import { PostBookmarksService } from "./post.bookmarks.service";

const __RADIUS = 5;
type __PostFilters = Omit<SearchPostsDTO, "location">;

@Injectable()
export class SearchPostsService {

    constructor(
       @InjectRepository(Post)
       private readonly _postsRepository: Repository<Post>,
       @InjectRepository(GeoPostPointer)
       private readonly _pointersRepo: Repository<GeoPostPointer>,
       @InjectRepository(Applicant)
       private readonly _applicantsRepo: Repository<Applicant>,
       @Inject(PostBookmarksService)
       private readonly _bookmarksService: PostBookmarksService,
       @Inject(ModelDTOTransformerService)
       private readonly _transformerService: ModelDTOTransformerService,
    ) {}

    async searchPosts(dto: SearchPostsDTO) {
        const { location, ...filters } = dto;

        const results: Array<Post | [Post, Coordinates]> = location
            ? await this.searchWithPointer(location, filters)
            : await this.search(filters);

        return Promise.all(
            results.map(result =>
                this.toSearchPostResult(result)
            )
        );
    }

    async searchPostsAppliedTo(userId: number): Promise<SearchPostResult[]> {

        const applicants = await this._applicantsRepo
            .createQueryBuilder("applicant")
            .select("applicant.userId", "userId")
            .leftJoinAndSelect("applicant.post", "post")
            .where("userId = :userId", { userId })
            .getMany();

        return Promise.all(
            applicants.map(({ post }) =>
                this.toSearchPostResult(post)
            )
        );
    }

    async searchBookmarked(userId: number): Promise<SearchPostResult[]> {
        const posts = await this._bookmarksService.getBookmarked(userId);

        return Promise.all(
            posts.map(post =>
                this.toSearchPostResult(post)
            )
        );
    }

    private search(filters: __PostFilters): Promise<Post[]> {

        const qb = this._postsRepository
            .createQueryBuilder("post")
            .select("post.*");

        __setWhereClause(qb, filters);

        return qb.getMany();
    }

    private async searchWithPointer(
        location: Coordinates,
        filters: __PostFilters,
    ): Promise<[Post, Coordinates][]> {

        const qb = this._pointersRepo
            .createQueryBuilder("pointer")
            .select("pointer.*")
            .where(
                "ST_Distance_Sphere(pointer.location, ST_Point(:lng, :lat)) <= :radius",
                { ...location, radius: __RADIUS }
            )
            .leftJoinAndSelect("point.post", "post");

        __setWhereClause(qb, filters);

        const pointers = await qb.getMany();
        return pointers.map(ptr => [ptr.post, ptr.location]);
    }

    private toSearchPostResult(
        data: Post | [Post, Coordinates]
    ): Promise<SearchPostResult> {
        return data instanceof Post
            ? this._transformerService.toSearchPostResult(data)
            : this._transformerService.toSearchPostResult(...data);
    }


}

function __setWhereClause<M extends object>(
    qb: SelectQueryBuilder<M>,
    filters: __PostFilters,
): void {
    const { boardId, userId, keyword } = filters;

    qb.innerJoinAndSelect("post.board", "board")
        .innerJoinAndSelect("post.user", "user");

    boardId && qb.andWhere("board.id = :boardId", { boardId });
    userId && qb.andWhere("user.id = :userId", { userId });

    if (keyword) {
        qb.andWhere(new Brackets(qb =>
            qb.where("post.title LIKE :keyword", { keyword: `%${keyword}%` })
                .orWhere("post.content LIKE :keyword", { keyword: `%${keyword}%` })
        ));
    }
}