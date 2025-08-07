import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment, Post } from "../model";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CommentDTO, CreateCommentDTO, UpdateCommentDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import { PostCountsService } from "./post.counts.service";
import { makeSelectUserBadgeQuery } from "../../common/badge";

@Injectable()
export class CommentsService {

    constructor(
       @InjectRepository(Comment)
       private readonly _commentsRepo: Repository<Comment>,
       @InjectRepository(Post)
       private readonly _postsRepo: Repository<Post>,
       @Inject(PostCountsService)
       private readonly _countService: PostCountsService,
    ) {}

    @Transactional()
    async createComment(dto: CreateCommentDTO): Promise<number> {
        await this.checkConflict(dto);
        await this._commentsRepo.insert(dto);

        const { nComments } =  await this._countService.updateCount({
            postId: dto.postId,
            nComments: 1
        });

        return nComments;
    }

   async getPostComments(postId: number, userId: number): Promise<CommentDTO[]> {
        return this.createSelectQueryBuilder()
            .where("comment.postId = :postId")
            .setParameters({ postId, userId })
            .getRawMany<CommentDTO>();
   }

   async getUserComments(userId: number): Promise<CommentDTO[]> {
        return this.createSelectQueryBuilder()
            .where("comment.userId = :userId")
            .setParameters({ userId })
            .getRawMany<CommentDTO>();
   }

    async updateComment(dto: UpdateCommentDTO): Promise<string> {
        const { content, ...criteria } = dto;
        await this._commentsRepo.update(criteria, { content });
        return content;
    }

    @Transactional()
    async deleteComment(id: number, userId: number): Promise<number> {

       const comment = await this._commentsRepo.findOne({
           where: { id },
           select: ["userId", "postId"]
       });

       if (!comment) throw new NotFoundException();
       if (comment.userId != userId) throw new ForbiddenException();

       await this._commentsRepo.delete(id);

       const { nComments } = await this._countService.updateCount({
           postId: comment.postId,
           nComments: -1
       });

       return nComments;
    }

    private async checkConflict(dto: CreateCommentDTO): Promise<void> {
        const { postId } = dto;

        const exists = await this._postsRepo.exists({
                relations: { board: true },
                where: { id: postId, board: { isRecruit: false } }
        });

        if (!exists) throw new NotFoundException();
    }

    private createSelectQueryBuilder(): SelectQueryBuilder<Comment> {
        return this._commentsRepo
            .createQueryBuilder("comment")
            .select("comment.id", "id")
            .addSelect("comment.postId", "postId")
            .addSelect("comment.content", "content")
            .addSelect("comment.createdAt", "createdAt")
            .addSelect("comment.userId = :userId", "editable")
            .leftJoin("comment.user", "user")
            .addSelect(makeSelectUserBadgeQuery("user"), "author");
    }
}
