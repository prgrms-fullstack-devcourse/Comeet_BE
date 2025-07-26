import { Module } from '@nestjs/common';
import { join } from "node:path";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormDataSourceFactory, typeormOptionsFactory } from "./config/typeorm";
import { RedisModule } from "./config/redis";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";
import { TagsModule } from './tags';
import { GithubModule } from './github';
import { UsersModule } from './users';
import { AuthModule } from './auth';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, "..", ".env"),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeormOptionsFactory,
      dataSourceFactory: typeormDataSourceFactory,
      inject: [ConfigService]
    }),
    HttpModule.register({ global: true }),
    ScheduleModule.forRoot(),
    RedisModule,
    TagsModule,
    GithubModule,
    UsersModule,
    AuthModule,
    PostsModule,
  ],
})
export class AppModule {}
