import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse,
    ApiOperation, ApiParam, ApiQuery, ApiResetContentResponse,
    ApiTags, ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import {
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CommentsService } from "../service";
import { User } from "../../../utils";
import { CreateCommentBody, GetCommentsQuery, GetCommentsResponse, UpdateCommentBody } from "../api";

@ApiTags("Comments")
@Controller("/api/comments")
@UseGuards(AuthGuard("jwt"))
export class CommentsController {

    constructor(
        @Inject(CommentsService)
        private readonly _commentsService: CommentsService,
    ) {}

    @Post("/")
    @ApiOperation({ summary: "댓글 생성" })
    @ApiBearerAuth()
    @ApiBody({ type: CreateCommentBody, required: true })
    @ApiCreatedResponse()
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    async createComment(
        @User("id")
        userId: number,
        @Body()
        body: CreateCommentBody
    ): Promise<void> {
        await this._commentsService.createComment({
            userId, ...body
        });
    }

    @Get("/")
    @ApiOperation({ summary: "댓글 조회" })
    @ApiBearerAuth()
    @ApiQuery({ type: GetCommentsQuery, required: true })
    @ApiOkResponse({ type: GetCommentsResponse })
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    async getComments(
        @Query() { postId }: GetCommentsQuery,
        @User("id") requestBy: number
    ): Promise<GetCommentsResponse> {

        const results = await this._commentsService
            .getComments({ postId, requestBy });

        return { results };
    }

    @Patch("/:id")
    @ApiOperation({ summary: "댓글 수정" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "댓글 id" })
    @ApiBody({ type: UpdateCommentBody, required: true })
    @ApiResetContentResponse()
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    @HttpCode(HttpStatus.RESET_CONTENT)
    async updateComment(
        @Param("id") id: number,
        @User("userId") userId: number,
        @Body() body: UpdateCommentBody
    ): Promise<void> {
        await this._commentsService
            .updateComment({ id, userId, ...body });
    }

    @Delete("/:id")
    @ApiOperation({ summary: "댓글 삭제" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "댓글 id" })
    @ApiNoContentResponse()
    @ApiForbiddenResponse()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComment(
        @Param("id") id: number,
        @User("id") userId: number,
    ): Promise<void> {
        await this._commentsService.deleteComment(id, userId);
    }
}