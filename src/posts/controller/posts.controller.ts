import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { PostsService, SearchPostsService } from "../service";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse,
    ApiParam, ApiQuery, ApiResetContentResponse,
    ApiTags,
    ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import { User } from "../../utils";
import { PostDTO } from "../dto";
import { CreatePostBody, GetPostsQuery, GetPostsResponse, UpdatePostBody } from "../api/post";
import { UpdateLikeResponse } from "../../likes/api";

@ApiTags("Posts")
@Controller("/api/boards")
export class PostsController {
    constructor(
        @Inject(PostsService)
        private readonly _postsService: PostsService,
        @Inject(SearchPostsService)
        private readonly _searchPostsService: SearchPostsService,
    ) {}


    @Post("/:id/posts")
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "게시판 아이디" })
    @ApiBody({ type: CreatePostBody, required: true })
    @ApiCreatedResponse()
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    async createPost(
        @Param("id") boardId: number,
        @User("id") userId: number,
        @Body() body: CreatePostBody,
    ): Promise<void> {
        await this._postsService.createPost({
            boardId, userId, ...body
        });
    }

    @Get("/posts/:id")
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 아이디" })
    @ApiOkResponse({ type: GetPostsResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    async getPost(
        @Param("id") id: number,
        @User("id") userId: number,
    ): Promise<PostDTO> {
        return this._postsService.getPost(id, userId);
    }

    @Get("/posts")
    @ApiBearerAuth()
    @ApiQuery({ type: GetPostsQuery })
    @ApiOkResponse({ type: GetPostsResponse })
    @ApiForbiddenResponse()
    async getPosts(
        @Query() query: GetPostsQuery,
    ): Promise<GetPostsResponse> {
        const results = await this._searchPostsService.searchPosts(query);
        return { results };
    }

    @Patch("/posts/:id")
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 아이디" })
    @ApiBody({ type: UpdatePostBody, required: true })
    @ApiResetContentResponse()
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    async updatePost(
        @Param("id") id: number,
        @User("id") userId: number,
        @Body() body: UpdatePostBody
    ) {
        await this._postsService.updatePost({
            id, userId, ...body
        });
    }

    @Put("/posts/:id/likes")
    @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 아이디" })
    @ApiOkResponse({ type: UpdateLikeResponse })
    @ApiForbiddenResponse()
    async updateLike(
        @Param("id") id: number,
        @User("id") userId: number,
    ) {
        return this._postsService.updateLike(id, userId);
    }

    @Delete("/posts/:id")
    @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 아이디" })
    @ApiOkResponse({ type: UpdateLikeResponse })
    @ApiForbiddenResponse()
    async deletePost(
        @Param("id") id: number,
        @User("id") userId: number,
    ) {
       await this._postsService.deletePost(id, userId);
    }
}