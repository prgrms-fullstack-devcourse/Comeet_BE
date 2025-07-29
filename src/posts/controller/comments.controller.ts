import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CommentsService } from "../service";
import { User } from "../../utils";
import {
    CreateOrDeleteCommentResponse,
    GetCommentsResponse,
    UpdateCommentResponse,
    UpsertCommentBody
} from "../api/comment";
import {
    ApiBearerAuth,
    ApiBody, ApiCreatedResponse,
    ApiForbiddenResponse, ApiNoContentResponse,
    ApiNotFoundResponse, ApiOkResponse,
    ApiOperation,
    ApiParam, ApiResetContentResponse,
    ApiTags, ApiUnprocessableEntityResponse
} from "@nestjs/swagger";

@ApiTags("Comments")
@Controller("/api/posts")
@UseGuards(AuthGuard("jwt"))
export class CommentsController {

    constructor(
       @Inject(CommentsService)
       private readonly _commentsService: CommentsService,
    ) {}

    @Post("/:id")
    @ApiOperation({ summary: "댓글 생성" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "댓글을 달 게시물 id" })
    @ApiBody({ type: UpsertCommentBody, required: true })
    @ApiCreatedResponse({ type: CreateOrDeleteCommentResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse({ description: "해당 아이디를 가진 게시물이 존재하지 않거나, 모집공고인 경우" })
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 body" })
    async createComment(
        @Param("postId") postId: number,
        @User("id") userId: number,
        @Body() body: UpsertCommentBody
    ): Promise<CreateOrDeleteCommentResponse> {

       const nComments =  await this._commentsService.createComment({
            postId, userId, ...body
        });

       return { nComments };
    }

    @Get("/:postsId")
    @ApiOperation({ summary: "게시물 댓글 조회" })
    @ApiBearerAuth()
    @ApiParam({ name: "postId", type: "integer", required: true, description: "댓글을 가져올 게시물 id" })
    @ApiOkResponse({ type: GetCommentsResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse({ description: "해당 아이디를 가진 게시물이 존재하지 않음" })
    async getPostComments(
        @Param("id") postId: number,
        @User("id") userId: number,
    ): Promise<GetCommentsResponse> {
        const results = await this._commentsService.getPostComments(postId, userId);
        return { results };
    }

    @Get("/")
    @ApiOperation({ summary: "내가 쓴 댓글 조회" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: GetCommentsResponse })
    @ApiForbiddenResponse()
    async getUserComments(
        @User("id") userId: number,
    ): Promise<GetCommentsResponse> {
        const results = await this._commentsService.getUserComments(userId);
        return { results };
    }

    @Patch("/comments/:id")
    @ApiOperation({ summary: "댓글 수정" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "수정할 댓글 id" })
    @ApiBody({ type: UpsertCommentBody, required: true })
    @ApiResetContentResponse({ type: UpdateCommentResponse })
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 body" })
    @HttpCode(HttpStatus.RESET_CONTENT)
    async updateComment(
        @Param("id") id: number,
        @User("id") userId: number,
        @Body() body: UpsertCommentBody
    ): Promise<UpdateCommentResponse> {

        const content = await this._commentsService.updateComment({
            id, userId, ...body
        });

        return { content };
    }

    @Delete("/comments/:id")
    @ApiOperation({ summary: "댓글 삭제" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "삭제할 댓글 id" })
    @ApiNoContentResponse({ type: CreateOrDeleteCommentResponse })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComment(
        @Param("id") id: number,
        @User("id") userId: number,
    ): Promise<CreateOrDeleteCommentResponse> {
        const nComments = await this._commentsService.deleteComment(id, userId);
        return { nComments };
    }
}