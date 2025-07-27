import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment, Post } from "../model";
import { Repository } from "typeorm";
import { CommentDTO, CreateCommentDTO, UpdateCommentDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import { pick } from "../../utils";
import { CommentsCountService } from "./comments.count.service";

@Injectable()
export class CommentsService {

    constructor(
       @InjectRepository(Comment)
       private readonly _commentsRepo: Repository<Comment>,
       @InjectRepository(Post)
       private readonly _postsRepo: Repository<Post>,
       @Inject(CommentsCountService)
       private readonly _countService: CommentsCountService,
    ) {}

    @Transactional()
    async createComment(dto: CreateCommentDTO): Promise<void> {
        await this.checkConflict(dto);
        await this._commentsRepo.insert(dto);
        await this._countService.updateCount(dto.postId, 1);
    }

   async getPostComments(postId: number, userId: number): Promise<CommentDTO[]> {

        const comments = await this._commentsRepo.find({
            relations: { user: true },
            where: { postId }
        });

        return comments.map(comment => __toDTO(comment, userId));
   }

   async getUserComments(userId: number): Promise<CommentDTO[]> {

       const comments = await this._commentsRepo.find({
           relations: { user: true },
           where: { userId }
       });

       return comments.map(comment => __toDTO(comment, userId));
   }

    async updateComment(dto: UpdateCommentDTO): Promise<void> {
        const { content, ...criteria } = dto;
        await this._commentsRepo.update(criteria, { content });
    }

    @Transactional()
    async deleteComment(id: number, userId: number): Promise<void> {
       const comment = await this._commentsRepo.findOneBy({ id, userId });

       if (comment) {
           await this._commentsRepo.delete(id);
           await this._countService.updateCount(id, -1);
       }
    }

    countComments(postId: number): Promise<number> {
        return this._countService.countComments(postId);
    }

    private async checkConflict(dto: CreateCommentDTO): Promise<void> {

        const exists = await this._postsRepo.existsBy({
            id: dto.postId,
            isRecruit: false
        });

        if (!exists) throw new ConflictException();
    }
}

function __toDTO(comment: Comment, userId: number): CommentDTO {
    return {
        ...pick(comment, ["id", "postId", "content", "createdAt"]),
        author: comment.user?.nickname ?? "알수없음",
        editable: comment.userId === userId
    };
}
