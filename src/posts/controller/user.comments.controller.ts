import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CommentsService } from "../service";
import { GetCommentsResponse } from "../api/comment";
import { User } from "../../utils";

@Controller("/api/users/comments")
@UseGuards(AuthGuard("jwt"))
export class UserCommentsController {

    constructor(
        @Inject(CommentsService)
        private readonly _commentsService: CommentsService,
    ) {}

    @Get("/")
    async getComments(
        @User("id") userId: number,
    ): Promise<GetCommentsResponse> {
        const results = await this._commentsService.getUserComments(userId);
        return { results };
    }
}