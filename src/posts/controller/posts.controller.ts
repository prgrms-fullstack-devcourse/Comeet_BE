import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { PostsService } from "../service/posts.service";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../../utils";

@Controller("/api/posts")
@UseGuards(AuthGuard("jwt"))
export class PostsController {

    constructor(
       @Inject(PostsService)
        private readonly _postsService: PostsService,
    ) {}

    @Get("/")
    async getUserPosts(
        @User("id") userId: number
    ) {

    }
}