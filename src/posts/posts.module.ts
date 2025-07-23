import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment, Post } from "./model";
import { CommentsService, PostsService } from "./service";
import { CommentsController, PostsController, UserCommentsController, UserPostsController } from "./controller";
import { LikesModule, LikesService } from "../likes";
import { LikeMark } from "../likes/model";

const __EXTERNAL_PROVIDERS = [LikesService];

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, Comment, LikeMark]),
        LikesModule
    ],
    providers: [
        ...__EXTERNAL_PROVIDERS,
        PostsService,
        CommentsService,
    ],
    controllers: [
        PostsController,
        CommentsController,
        UserPostsController,
        UserCommentsController,
    ]

})
export class PostsModule {}
