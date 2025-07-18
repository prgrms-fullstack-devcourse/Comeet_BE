import { Module } from '@nestjs/common';
import { join } from "node:path";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormDataSourceFactory, typeormOptionsFactory } from "./config/typeorm";
import { RedisModule } from "./config/redis";
import { HttpModule } from "@nestjs/axios";
import { UsersModule } from './users';
import { AuthModule } from './auth';
import { GithubModule } from './github';
import { TagsModule } from './tags/tags.module';
import { CommunityModule } from './community/community.module';

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
    RedisModule,
    UsersModule,
    AuthModule,
    GithubModule,
    TagsModule,
    CommunityModule
  ],
})
export class AppModule {}
