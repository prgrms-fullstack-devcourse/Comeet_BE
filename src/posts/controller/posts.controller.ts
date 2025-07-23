import {
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post, Put,
    Query,
    UseGuards
} from "@nestjs/common";
import { PostsService } from "../service";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../../utils";
import { CreatePostBody, GetPostsQuery, GetPostsResponse, UpdatePostBody, UpdatePostLikeResponse } from "../api";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse,
    ApiOperation, ApiParam, ApiQuery, ApiResetContentResponse,
    ApiTags, ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import { PostDTO } from "../dto";

@ApiTags("Posts")
@Controller("/api/posts")
@UseGuards(AuthGuard("jwt"))
export class PostsController {

    constructor(
       @Inject(PostsService)
       private readonly _postsService: PostsService,
    ) {}

   @Post("/")
   @ApiOperation({ summary: "게시물 생성" })
   @ApiBearerAuth()
   @ApiBody({ type: CreatePostBody, required: true })
   @ApiCreatedResponse()
   @ApiForbiddenResponse()
   @ApiUnprocessableEntityResponse()
   async createPost(
       @User("id")
       userId: number,
       @Body()
       body: CreatePostBody
   ): Promise<void> {
        await this._postsService.createPost({ userId, ...body });
   }

   @Get("/")
   @ApiOperation({ summary: "게시물 검색" })
   @ApiBearerAuth()
   @ApiQuery({ type: GetPostsQuery, required: true })
   @ApiOkResponse({ type: GetPostsResponse })
   @ApiForbiddenResponse()
   @ApiUnprocessableEntityResponse()
   async getPosts(
       @Query()
       query: GetPostsQuery,
   ): Promise<GetPostsResponse> {
        const results = await this._postsService.searchPosts(query);
        return { results };
   }

   @Get("/:id")
   @ApiOperation({ summary: "게시물 조회" })
   @ApiBearerAuth()
   @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 id" })
   @ApiOkResponse({ type: PostDTO })
   @ApiForbiddenResponse()
   @ApiNotFoundResponse()
   async getPost(
       @Param("id") id: number,
       @User("id") userId: number
   ): Promise<PostDTO> {
        return await this._postsService.getPost(id, userId);
   }

   @Patch("/:id")
   @ApiOperation({ summary: "게시물 수정" })
   @ApiBearerAuth()
   @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 id" })
   @ApiBody({ type: UpdatePostBody, required: true })
   @ApiResetContentResponse()
   @ApiForbiddenResponse()
   @ApiUnprocessableEntityResponse()
   @HttpCode(HttpStatus.RESET_CONTENT)
   async updatePost(
       @Param("id") id: number,
       @User("id") userId: number,
       @Body() body: UpdatePostBody
   ): Promise<void> {
        await this._postsService.updatePost({
            id, userId, ...body
        });
   }

    @Put("/:id/likes")
    @ApiOperation({ summary: "게시물 좋아요/좋아요 해제" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 id" })
    @ApiOkResponse({ type: UpdatePostLikeResponse })
    @ApiForbiddenResponse()
    async updatePostLike(
        @Param("id") id: number,
        @User("id") userId: number,
    ) {
      const nLikes = await this._postsService.updatePostLike(id, userId);
      return { nLikes };
    }

   @Delete("/:id")
   @ApiOperation({ summary: "게시물 삭제" })
   @ApiBearerAuth()
   @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 id" })
   @ApiNoContentResponse()
   @ApiForbiddenResponse()
   @HttpCode(HttpStatus.NO_CONTENT)
   async deletePost(
       @Param("id") id: number,
       @User("id") userId: number,
   ): Promise<void> {
        await this._postsService.deletePost(id, userId);
   }

}