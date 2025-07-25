import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "../../model";
import { Between, FindOptionsWhere, Like, Repository } from "typeorm";
import { CommentsService } from "./comments.service";
import { PostDTO, PostDTO, SearchPostResult } from "../../dto";
import { LikesService } from "../../../likes";
import { PostsServiceBase } from "../posts.service.base";

@Injectable()
export class PostsService extends PostsServiceBase<
    PostDTO, "title" | "content"
> {
    protected readonly _postType: string = "post";
    private readonly _logger: Logger = new Logger(PostsService.name);

    constructor(
       @InjectRepository(Post)
       protected readonly _repo: Repository<Post>,
       @Inject(LikesService)
       protected readonly _likesService: LikesService,
       @Inject(CommentsService)
       private readonly _commentsService: CommentsService,
    ) { super(); }

    async getPost(id: number, userId: number): Promise<PostDTO> {

        const post = await this._repo.findOne({
           relations: { comments: true },
           where: { id },
        });

        if (!post) throw new NotFoundException();
        return this.toDTO(post, userId);
    }
    async searchPosts(
        dto: PostDTO.SearchDTO
    ): Promise<SearchPostResult[]> {

        const posts = await this._repo.findBy(
            __makeWhereOptions(dto)
        );

        return Promise.all(
            posts.map(post =>
                this.toSearchResult(post)
            )
        );
    }

    async deletePost(id: number, userId: number): Promise<boolean> {
        const deleted = await super.deletePost(id, userId);
        deleted && await this._commentsService.onPostDeleted(id);
        return deleted;
    }

    async toDTO(post: Post, userId: number): Promise<PostDTO> {
       return {
           ...await super.toDTO(post, userId),
           comments: post.comments.map(comment =>
               CommentsService.toCommentDTO(comment, userId)
           )
       };
    }

    async toSearchResult(post: Post): Promise<SearchPostResult> {
        return {
            ...await super.toSearchResult(post),
            nComments: await this._commentsService.countPostComments(post.id),
        };
    }

}



function __makeWhereOptions(
    dto: PostDTO.SearchDTO
): FindOptionsWhere<Post> {
    const { keyword, createdAt, ...rest } = dto;
    const where: FindOptionsWhere<Post> = rest;

    keyword && Object.assign(where, {
        $or: [
            { title: Like(`%${keyword}%`) },
            { content: Like(`%${keyword}%`) }
        ]
    });

    if (createdAt) {
        where.createdAt = createdAt instanceof Date
            ? createdAt : Between(...createdAt);
    }

    return where;
}

