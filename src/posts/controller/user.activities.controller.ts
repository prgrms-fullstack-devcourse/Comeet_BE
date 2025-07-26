import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SearchPostsService } from "../service";
import { User } from "../../utils";
import { GetPostsResponse } from "../api/post";

@Controller("/api/users/activities")
@UseGuards(AuthGuard("jwt"))
export class UserActivitiesController {

    constructor(
        @Inject(SearchPostsService)
        private readonly _searchPostsService: SearchPostsService,
    ) {}

    @Get("/")
    async getPosts(
        @User("id") userId: number,
    ): Promise<GetPostsResponse> {

        const results = await this._searchPostsService
            .searchPostsAppliedTo(userId);

        return { results };
    }
}