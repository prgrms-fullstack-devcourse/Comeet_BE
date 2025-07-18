import { Module } from "@nestjs/common";
import { GithubOAuth2Guard } from "./github.oauth2.guard";
import { GithubOAuth2Service } from "./service";
import { GithubOAuth2Options } from "./github.oauth2.options";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GitHubAccount } from "./model";
import { GithubService } from './service';

@Module({
    imports: [
        TypeOrmModule.forFeature([GitHubAccount])
    ],
    providers: [
        GithubOAuth2Guard,
        GithubOAuth2Service,
        GithubOAuth2Options,
        GithubService
    ],
    exports: [
        GithubOAuth2Guard,
        GithubService,
        GithubOAuth2Service,
        GithubOAuth2Options
    ]
})
export class GithubModule {}