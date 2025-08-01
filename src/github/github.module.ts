import { Module } from "@nestjs/common";
import { GenerateTokenService, GetUserService, GithubOAuth2Service } from "./service";
import { GithubOptions } from "./github.options";
import { PassportModule } from "@nestjs/passport";
import { GithubOAuth2Strategy } from "./github.oauth2.strategy";

@Module({
    imports: [PassportModule.register({ session: false }),],
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