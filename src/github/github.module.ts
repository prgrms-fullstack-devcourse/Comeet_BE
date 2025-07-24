import { Module } from "@nestjs/common";
import { GithubOAuth2Guard } from "./github.oauth2.guard";
import { GenerateTokenService, GetUserService, GithubOAuth2Service } from "./service";
import { GithubOptions } from "./github.options";
import { PassportModule } from "@nestjs/passport";
import { GithubOAuth2Strategy } from "./github.oauth2.strategy";

@Module({
    imports: [PassportModule.register({})],
    providers: [
        GithubOAuth2Strategy,
        GithubOAuth2Service,
        GenerateTokenService,
        GetUserService,
        GithubOptions
    ],
    exports: [
        GithubOAuth2Strategy,
        GithubOAuth2Service,
        GenerateTokenService,
        GetUserService,
        GithubOptions
    ],
})
export class GithubModule {}