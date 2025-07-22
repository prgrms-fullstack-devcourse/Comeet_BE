import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment, Post, PostLike } from "./model";

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostLike, Comment])],
})
export class PostsModule {}
