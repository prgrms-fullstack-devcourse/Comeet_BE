import { ApiTags } from "@nestjs/swagger";
import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SearchPostsService } from "../service";
import { GetPostsResponse } from "../api/post";
import { User } from "../../utils";

@ApiTags("Users", "Posts")
@Controller("/api/users/posts")
@UseGuards(AuthGuard("jwt"))
export class UserPostsController {

    constructor(
        @Inject(SearchPostsService)
        private readonly _searchPostsService: SearchPostsService,
    ) {}

    @Get("/")
    async getPosts(
        @User("id") userId: number,
    ): Promise<GetPostsResponse> {

        const results = await this._searchPostsService
            .searchPosts({ userId });

        return { results };
    }
}