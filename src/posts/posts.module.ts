import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Applicant, Board, Bookmark, Comment, Post, PostLike } from "./model";
import { PostCount } from "./model/post.count.model";
import { User } from "../users/model";
import { UserLocationInterceptor, UsersModule } from "../users";
import {
    ApplicantsService,
    BoardsService,
    BookmarksService, CommentsService,
    PostCountsService,
    PostLikesService,
    PostsService, SearchPostsService
} from "./service";
import {
    AppliesController, BoardsController,
    BookmarksController,
    CommentsController,
    PostLikesController,
    PostsController
} from "./controller";

const __EXTERNAL_PROVIDERS = [UserLocationInterceptor];

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Board, Post, PostCount, PostLike,
            Bookmark, Applicant, Comment, User
        ]),
        UsersModule,
    ],
    providers: [
        ...__EXTERNAL_PROVIDERS,
        BoardsService,
        PostsService,
        PostCountsService,
        PostLikesService,
        BookmarksService,
        ApplicantsService,
        CommentsService,
        SearchPostsService,
    ],
    controllers: [
        BoardsController,
        PostsController,
        PostLikesController,
        BookmarksController,
        AppliesController,
        CommentsController
    ]
})
export class PostsModule {}
