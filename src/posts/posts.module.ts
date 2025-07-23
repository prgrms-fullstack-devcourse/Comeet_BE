import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment, Post, PostLike } from "./model";
import { PostsService } from "./service/posts.service";
import { PostLikesService } from "./service/post.likes.service";
import { CommentsService } from "./service/comments.service";
import { CommentsController, PostsController, UserCommentsController, UserPostsController } from "./controller";

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostLike, Comment])],
    providers: [
        PostsService,
        PostLikesService,
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
