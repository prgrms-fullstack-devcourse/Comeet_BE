import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Comment } from "../model";
import { CommentDTO, CreateCommentDTO, GetCommentsDTO, UpdateCommentDTO } from "../dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Redis from "iovalkey";

@Injectable()
export class CommentsService implements OnModuleInit, OnModuleDestroy {

    constructor(
       @InjectRepository(Comment)
       private readonly _commentsRepos: Repository<Comment>,
       @Inject(Redis)
       private readonly _redis: Redis,
    ) {}

    static toCommentDTO(comment: Comment, userId?: number): CommentDTO {
        const { id, content, createdAt } = comment;
        const editable = comment.userId === userId;
        return { id, content, createdAt, editable };
    }

    async onModuleInit(): Promise<void> {

        const record = await this._commentsRepos.find()
            .then(__countComments)
            .catch(err => { throw err; });

        await this._redis.hset("comments", record);
    }

    async onModuleDestroy(): Promise<void> {
        await this._redis.del("comments");
    }

    countComments(postId: number): Promise<number> {
        return this._redis.hget("comments", __makeKey(postId))
            .then(Number)
            .catch(err => { throw err; });
    }

    async createComment(dto: CreateCommentDTO): Promise<CommentDTO> {
        const comment: Comment = await this._commentsRepos.save(dto);
        await this.updateCount(comment.postId, 1);
        return CommentsService.toCommentDTO(comment, comment.userId);
    }

    async getComments(dto: GetCommentsDTO): Promise<CommentDTO[]> {
        const comments = await this._commentsRepos.findBy(dto);

        return comments.map(comment =>
            CommentsService.toCommentDTO(comment, dto.userId)
        );
    }

    async updateComment(dto: UpdateCommentDTO): Promise<void> {
        const { content, ...criteria } = dto;
        await this._commentsRepos.update(criteria, { content });
    }

    private async updateCount(postId: number, delta: number): Promise<void> {
        const cnt = await this.countComments(postId);
        await this._redis.hset("comments", [__makeKey(postId), cnt + delta]);
    }
}

function __makeKey(postId: number): string {
    return `post:${postId}`;
}

function __countComments(comments: Comment[]): Record<string, number> {
    const record: { [key: string]: number } = {};

    comments.map(({ postId }) => __makeKey(postId))
        .forEach(k => record[k] = (record[k] ?? 0) + 1);

    return record;
}