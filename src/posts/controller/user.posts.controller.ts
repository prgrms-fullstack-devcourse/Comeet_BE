import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { PostsService } from "../service";
import { GetPostsResponse } from "../api";
import { User } from "../../utils";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Users", "Posts")
@Controller("/api/users/posts")
@UseGuards(AuthGuard("jwt"))
export class UserPostsController {

    constructor(
        @Inject(PostsService)
        private readonly _postsService: PostsService,
    ) {}

    @Get("/")
    @ApiOperation({ summary: "유저가 작성한 게시물 검색" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: GetPostsResponse })
    @ApiForbiddenResponse()
    async getUserPosts(
        @User("id")
        userId: number
    ): Promise<GetPostsResponse> {
        const results = await this._postsService.searchPosts({ userId });
        return  { results };
    }
}