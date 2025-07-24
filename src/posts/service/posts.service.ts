import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "../model";
import { Between, FindOptionsWhere, In, Like, Repository } from "typeorm";
import { CommentsService } from "./comments.service";
import { CreatePostDTO, PostDTO, SearchPostResult, SearchPostsDTO, UpdatePostDTO } from "../dto";
import { pick } from "../../utils/object";
import { Transactional } from "typeorm-transactional";
import { LikesService } from "../../likes";
import { LikeDTO, TargetDTO } from "../../likes/dto";

@Injectable()
export class PostsService {
    private readonly _logger: Logger = new Logger(PostsService.name);

    constructor(
       @InjectRepository(Post)
       private readonly _postsRepo: Repository<Post>,
       @Inject(LikesService)
       private readonly _likesService: LikesService,
       @Inject(CommentsService)
       private readonly _commentsService: CommentsService,
    ) {}

    async createPost(dto: CreatePostDTO): Promise<void> {
        const post = await this._postsRepo.save(dto);
        this._logger.log(JSON.stringify(post));
    }

    async getPost(id: number, userId: number): Promise<PostDTO> {

        const post = await this._postsRepo.findOne({
            relations: { category: true, user: true, comments: true },
            where: { id }
        });

        if (!post) throw new NotFoundException();
        return this.toPostDTO(post, userId);
    }

    async searchPosts(dto: SearchPostsDTO): Promise<SearchPostResult[]> {

        const posts = await this._postsRepo.find({
            relations: { category: true },
            where: __makeWhereOptions(dto)
        });

        return Promise.all(
            posts.map(post =>
                this.toSearchPostResult(post)
            )
        );
    }

    async updatePost(dto: UpdatePostDTO): Promise<void> {
        const { id, userId, ...values } = dto;

        if (Object.keys(values).length)
            await this._postsRepo.update({ id, userId }, values);
    }

    updatePostLike(id: number, userId: number): Promise<number> {
        return this._likesService.updateLike(__makeLike(id, userId));
    }

    @Transactional()
    async deletePost(id: number, userId: number): Promise<void> {
        const { affected } = await this._postsRepo.delete({ id, userId });

        if (affected) {
            await this._likesService.onTargetDeleted(__makeTarget(id));
            await this._commentsService.onPostDeleted(id);
        }
    }

    private async toSearchPostResult(post: Post): Promise<SearchPostResult> {
        const category = post.category.value;
        const author = post.user?.nickname ?? "알수없음";
        const nLikes = await this._likesService.countLikes(__makeTarget(post.id));
        const nComments = await this._commentsService.countPostComments(post.id);

        return {
            ...pick(post, ["id", "title", "createdAt"]),
            category, author, nLikes, nComments
        };
    }

    private async toPostDTO(post: Post, userId: number): Promise<PostDTO> {
        const category = post.category.value;
        const author = post.user?.nickname ?? "알수없음";
        const editable = post.userId === userId;

        const [nLikes, likeIt] = await this._likesService
            .countAndCheckLike(__makeLike(post.id, userId));

        const comments = post.comments.map(comment =>
            CommentsService.toCommentDTO(comment, userId)
        );

        return {
            ...pick(post, ["id", "title", "content", "createdAt"]),
            category, author, editable, nLikes, likeIt, comments
        };
    }

}

function __makeLike(id: number, userId: number): LikeDTO {
    return {
        ...__makeTarget(id),
        userId
    };
}

function __makeTarget(id: number): TargetDTO {
    return { targetType: "post", targetId: id };
}

function __makeWhereOptions(dto: SearchPostsDTO): FindOptionsWhere<Post> {
    const { ids, keyword, createdAt, ...rest } = dto;
    const where: FindOptionsWhere<Post> = rest;

    ids?.length && (where.id = In(ids));

    keyword && Object.assign(where, {
        $or: [
            { title: Like(`%${keyword}%`) },
            { content: Like(`%${keyword}%`) }
        ]
    });

    createdAt && (where.createdAt = Between(...createdAt));
    return where;
}

