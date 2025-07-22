import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "../model";
import { Repository } from "typeorm";
import { Inject } from "@nestjs/common";
import Redis from "iovalkey";
import { CommentDTO, CreateCommentDTO, DeleteCommentDTO, GetCommentsDTO, UpdateCommentDTO } from "../dto";
import { Transactional } from "typeorm-transactional";

const __REDIS_KEY = "comments_count";

export class CommentsService {

    constructor(
        @InjectRepository(Comment)
        private readonly _commentsRepo: Repository<Comment>,
        @Inject(Redis)
        private readonly _redis: Redis
    ) {}

    static toCommentDTO(comment: Comment, userId?: number): CommentDTO {
        const { id, content, createdAt, user } = comment;
        const author = user?.nickname ?? "알수없음";
        const editable = !!user && user.id === userId;
        return { id, author, content, createdAt, editable };
    }

    @Transactional()
    async createComment(dto: CreateCommentDTO): Promise<void> {
        await this._commentsRepo.save(dto);
        await this.updateCount(dto.postId, 1);
    }

    async getComments(dto: GetCommentsDTO): Promise<CommentDTO[]> {
        const comments = await this._commentsRepo.find({ relations: { user: true } });

        return comments.map(comment =>
            CommentsService.toCommentDTO(comment, dto.userId)
        );
    }

    async updateComment(dto: UpdateCommentDTO): Promise<void> {
        const { content, ...criteria } = dto;
        await this._commentsRepo.update(criteria, { content });
    }

    @Transactional()
    async deleteComment(dto: DeleteCommentDTO): Promise<void> {
        const { affected } = await this._commentsRepo.delete(dto);
        affected && await this.updateCount(dto.postId, -affected);
    }

    async countPostComments(postId: number): Promise<number> {
        const field = __makeField(postId);

        if (!await this._redis.hexists(__REDIS_KEY, field)) {
            const count = await this._commentsRepo.countBy({ postId });
            await this._redis.hset(__REDIS_KEY, field, count);
            return count;
        }

        return this._redis.hget(__REDIS_KEY, field)
            .then(Number).catch(err => {  throw err; });
    }

    async onPostDeleted(postId: number): Promise<void> {
        await this._redis.hdel(__REDIS_KEY, __makeField(postId));
    }

    private async updateCount(postId: number, delta: number) {
        const field = __makeField(postId);
        const count = await this._redis.hget(__REDIS_KEY, field);
        await this._redis.hset(__REDIS_KEY, field, Number(count) + delta);
    }
}

function __makeField(postId: number) {
    return `post:${postId}`;
}