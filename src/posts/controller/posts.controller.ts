import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { PostsService, SearchPostsService } from "../service";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation,
    ApiParam, ApiQuery, ApiResetContentResponse,
    ApiTags,
    ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import { User } from "../../utils";
import { PostDTO } from "../dto";
import { CreatePostBody, SearchPostsQuery, SearchPostsResponse, UpdatePostBody } from "../api/post";
import { UserLocationInterceptor } from "../../users";
import { SearchAdjacentPostsQuery } from "../api/post/search.adjacent.posts.query";
import { SearchAdjacentPostsResponse } from "../api/post/search.adjacent.posts.response";
import { AuthGuard } from "@nestjs/passport";
import { Coordinates } from "../../common/geo";
import { UpdateLikeResponse } from "../api";

@ApiTags("Posts")
@Controller("/api/posts")
@UseGuards(AuthGuard("jwt"))
export class PostsController {
    constructor(
        @Inject(PostsService)
        private readonly _postsService: PostsService,
        @Inject(SearchPostsService)
        private readonly _searchPostsService: SearchPostsService,

    ) {}

    @Post("/:boardId")
    @ApiOperation({ summary: "게시물 생성" })
    @ApiBearerAuth()
    @ApiParam({ name: "boardId", type: "integer", required: true, description: "게시판 아이디" })
    @ApiBody({ type: CreatePostBody, required: true })
    @ApiCreatedResponse()
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    @UseInterceptors(UserLocationInterceptor)
    async createPost(
        @Param("boardId") boardId: number,
        @User("id") userId: number,
        @User("location") location: Coordinates,
        @Body() body: CreatePostBody,
    ): Promise<void> {
        body.location || Object.assign(body, { location });
        await this._postsService.createPost({ boardId, userId, ...body });
    }

    @Get("/details/:id")
    @ApiOperation({ summary: "게시물 조회" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 아이디" })
    @ApiOkResponse({ type: SearchPostsResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    async getPost(
        @Param("id") id: number,
        @User("id") userId: number,
    ): Promise<PostDTO> {
        return this._postsService.getPost(id, userId);
    }

    @Get("/search")
    @ApiOperation({ summary: "게시물 검색" })
    @ApiBearerAuth()
    @ApiQuery({ type: SearchPostsQuery, required: true })
    @ApiOkResponse({ type: SearchPostsResponse })
    @ApiForbiddenResponse()
    async searchPosts(
        @Query()
        query: SearchPostsQuery,
    ): Promise<SearchPostsResponse> {
        const results = await this._searchPostsService.searchPosts(query);
        return { results };
    }

    @Get("/search/near")
    @ApiOperation({ summary: "게시물 검색" })
    @ApiBearerAuth()
    @ApiQuery({ type: SearchAdjacentPostsQuery, required: true })
    @ApiOkResponse({ type: SearchAdjacentPostsResponse })
    @ApiForbiddenResponse()
    @UseInterceptors(UserLocationInterceptor)
    async searchAdjacentPosts(
        @User("location") origin: Coordinates,
        @Query() query: SearchAdjacentPostsQuery,
    ): Promise<SearchAdjacentPostsResponse> {

        const results = await this._searchPostsService
            .searchAdjacentPosts({ origin, ...query });

        return { results };
    }

    @Get("/users")
    @ApiOperation({ summary: "내가 쓴 게시물 검색"})
    @ApiBearerAuth()
    @ApiOkResponse({ type: SearchPostsResponse })
    @ApiForbiddenResponse()
    async searchUserPosts(
        @User("id") userId: number,
    ): Promise<SearchPostsResponse> {
        const results = await this._searchPostsService.searchPosts({ userId });
        return { results };
    }

    @Get("/bookmarks")
    @ApiOperation({ summary: "북마크한 게시물 검색"})
    @ApiBearerAuth()
    @ApiOkResponse({ type: SearchPostsResponse })
    @ApiForbiddenResponse()
    async searchBookmarkPosts(
        @User("id") userId: number,
    ): Promise<SearchPostsResponse> {
        const results = await this._searchPostsService.searchBookmarkPosts(userId);
        return { results };
    }

    @Get("/applies")
    @ApiOperation({ summary: "지원한 모집글 검색"})
    @ApiBearerAuth()
    @ApiOkResponse({ type: SearchPostsResponse })
    @ApiForbiddenResponse()
    async searchAppliedTo(
        @User("id") userId: number,
    ): Promise<SearchPostsResponse> {
        const results = await this._searchPostsService.searchPostsAppliedTo(userId);
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