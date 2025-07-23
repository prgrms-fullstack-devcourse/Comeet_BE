import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CommentsService } from "../service/comments.service";
import { GetCommentsResponse } from "../api";
import { User } from "../../utils";
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Users", "Comments")
@Controller("/api/users/comments")
@UseGuards(AuthGuard("jwt"))
export class UserCommentsController {

    constructor(
       @Inject(CommentsService)
       private readonly _commentsService: CommentsService,
    ) {}

    @Get("/")
    @ApiOperation({ summary: "유저가 작성한 댓글 조회" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: GetCommentsResponse })
    @ApiForbiddenResponse()
    async getUserComments(
        @User("id")
        userId: number,
    ): Promise<GetCommentsResponse> {

        const results = await this._commentsService.getComments({
            userId, requestBy: userId
        });

        return { results };
    }
}