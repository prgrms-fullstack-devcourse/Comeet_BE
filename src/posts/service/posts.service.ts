import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post, Bookmark, PostLike, Applicant } from "../model";
import { Repository } from "typeorm";
import { CreatePostDTO, PostDTO, UpdatePostDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import { setSelectClause } from "./service.internal";
import { makeMarkExistsQuery } from "../../common/marks";
import { makeSelectCoordinatesQuery } from "../../common/geo";

@Injectable()
export class PostsService {

    constructor(
       @InjectRepository(Post)
       private readonly _postsRepo: Repository<Post>,
    ) {}

    @Transactional()
    async createPost(dto: CreatePostDTO): Promise<void> {
        await this._postsRepo.save({
            ...dto, count: {}
        });
    }

    async getPost(id: number, userId: number): Promise<PostDTO> {
        const qb = this._postsRepo.createQueryBuilder("post");

        const post = await setSelectClause(qb)
            .addSelect("post.content", "content")
            .addSelect(
                makeSelectCoordinatesQuery("post", "location"),
                "location"
            )
            .addSelect("post.userId = :userId", "editable")
            .addSelect(makeMarkExistsQuery(PostLike, qb), "likeIt")
            .addSelect(makeMarkExistsQuery(Bookmark, qb), "bookmark")
            .addSelect(
                `CASE 
                WHEN board.isRecruit 
                THEN ${makeMarkExistsQuery(Applicant, qb)}
                ELSE NULL
                END
                `
            )
            .where("post.id = :id")
            .setParameters({ id, userId })
            .getRawOne<PostDTO>();

        if (!post) throw new NotFoundException();
        return post;
    }

    @Transactional()
    async updatePost(dto: UpdatePostDTO): Promise<void> {
        const { id, userId, ...values } = dto;
        const { affected } = await this._postsRepo.update({ id, userId }, values);

        if (affected) {

            const { board: { isRecruit } } = await this._postsRepo.findOneOrFail({
                relations: { board: true },
                select: { board: { isRecruit: true } }
            });

            if (!isRecruit && values.location) throw new ConflictException();
        }
    }

    @Transactional()
    async deletePost(id: number, userId: number): Promise<void> {
        await this._postsRepo.delete({ id, userId });
    }
}

