import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GithubOAuth2Options {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly redirectUrl: string;
    readonly tokenUrl: string;
    readonly userUrl: string;

    constructor(
        @Inject(ConfigService)
        config: ConfigService,
    ) {
        this.clientId = config.get<string>("GITHUB_CLIENT_ID")!;
        this.clientSecret = config.get<string>("GITHUB_CLIENT_SECRET")!;
        this.redirectUrl = config.get<string>("GITHUB_REDIRECT_URL")!;
        this.tokenUrl = config.get<string>("GITHUB_TOKEN_URL")!;
        this.userUrl = config.get<string>("GITHUB_USER_URL")!;
    }
}