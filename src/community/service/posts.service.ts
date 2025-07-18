import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "../model";
import { Between, FindOptionsWhere, Like, Repository } from "typeorm";
import { CreatePostDTO, SearchPostsDTO, PostDTO, PostAbstractDTO, UpdatePostDTO } from "../dto";
import { PostLikesService } from "./post.likes.service";
import { CommentsService } from "./comments.service";

@Injectable()
export class PostsService {
    private readonly _logger: Logger = new Logger(PostsService.name);

    constructor(
       @InjectRepository(Post)
       private readonly _postsRepos: Repository<Post>,
       @Inject(PostLikesService)
       private readonly _likesService: PostLikesService,
       @Inject(CommentsService)
       private readonly _commentsService: CommentsService,
    ) {}

    async createPost(dto: CreatePostDTO): Promise<void> {
        const post = await this._postsRepos.save(dto);
        this._logger.log(post);
    }

    async getPost(id: number, userId?: number): Promise<PostDTO> {

        const post = await this._postsRepos.findOne({
            relations: { comments: true },
            where: { id }
        });

        if (!post) throw new NotFoundException();
        return await this.toPostDTO(post, userId);
    }

    async searchPosts(dto: SearchPostsDTO): Promise<PostAbstractDTO[]> {

        const posts = await this._postsRepos.find({
            where: __makeWhereOptions(dto)
        });

        return await Promise.all(
            posts.map(async ({ id, title, createdAt }) => {
                const likes = await this._likesService.countPostLikes(id);
                const likedIt = await this.likedIt(id, dto.userId);
                const nComments = await this._commentsService.countComments(id);
                return { id, title, likes, likedIt, nComments, createdAt };
            })
        );
    }

    async updatePost(dto: UpdatePostDTO): Promise<void> {
        const { id, userId, ...values } = dto;
        await this._postsRepos.update({ id, userId }, values);
    }

    private async toPostDTO(post: Post, userId?: number): Promise<PostDTO> {
        const { id, title, content, createdAt } = post;

        const likes = await this._likesService.countPostLikes(post.id);
        const comments = post.comments.map(CommentsService.toCommentDTO);
        const editable = post.userId === userId;
        const likedIt = await this.likedIt(post.id, userId);

        return { id, title, content, createdAt, comments, likes, likedIt, editable };
    }

    private async likedIt(postId: number, userId?: number): Promise<boolean> {
        return !!userId && await this._likesService.likedIt(postId, userId);
    }
}

function __makeWhereOptions(dto: SearchPostsDTO): FindOptionsWhere<Post> {
    const { keyword, createdAt, ...rest } = dto;
    const where: FindOptionsWhere<Post> = rest;

    if (keyword) {
        where.title = where.content = Like(`%${keyword}%`);
    }

    if (createdAt) {
        where.createdAt = createdAt instanceof Date
            ? createdAt : Between(...createdAt);
    }

    return where;
}