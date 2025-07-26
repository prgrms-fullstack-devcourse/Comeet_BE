import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CommentsService } from "../service";
import { User } from "../../utils";
import { GetCommentsResponse, UpsertCommentBody } from "../api/comment";

@Controller("/api/boards")
@UseGuards(AuthGuard("jwt"))
export class CommentsController {

    constructor(
       @Inject(CommentsService)
       private readonly _commentsService: CommentsService,
    ) {}

    @Post("/posts/:id/comments")
    async createComment(
        @Param("id") postId: number,
        @User("id") userId: number,
        @Body() body: UpsertCommentBody
    ) {
        await this._commentsService.createComment({
            postId, userId, ...body
        });
    }

    @Get("/posts/:id/comments")
    async getComments(
        @Param("id") postId: number,
        @User("id") userId: number,
    ): Promise<GetCommentsResponse> {
        const results = await this._commentsService.getPostComments(postId, userId);
        return { results };
    }

    @Patch("/comments/:id")
    async updateComment(
        @Param("id") id: number,
        @User("id") userId: number,
        @Body() body: UpsertCommentBody
    ) {
        await this._commentsService.updateComment({
            id, userId, ...body
        });
    }

    @Delete("/comments/:id")
    async deleteComment(
        @Param("id") id: number,
        @User("id") userId: number,
    ) {
        await this._commentsService.deleteComment(id, userId);
    }
}