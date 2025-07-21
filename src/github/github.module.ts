import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GithubAccount } from "./model";
import { GithubOAuth2Guard } from "./github.oauth2.guard";
import { GithubOptions } from "./github.options";
import { GithubTokensStorage } from "./github.tokens.storage";
import { GenerateTokenService, GitHubAccountsService, GithubAuthService, GithubClientService } from "./service";

@Module({
    imports: [TypeOrmModule.forFeature([GithubAccount])],
    providers: [
        GithubOAuth2Guard,
        GithubOptions,
        GithubTokensStorage,
        GitHubAccountsService,
        GithubAuthService,
        GithubClientService,
        GenerateTokenService
    ],
    exports: [
        GithubOAuth2Guard,
        GithubOptions,
        GithubTokensStorage,
        GitHubAccountsService,
        GithubAuthService,
        GithubClientService,
        GenerateTokenService
    ]
})
export class GithubModule {}