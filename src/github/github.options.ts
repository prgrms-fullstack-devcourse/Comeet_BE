import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GithubOptions {
    readonly clientId: string
    readonly clientSecret: string

    constructor(
       @Inject(ConfigService)
       config: ConfigService,
    ) {
        this.clientId = config.get<string>("GITHUB_API_CLIENT_ID")!;
        this.clientSecret = config.get<string>("GITHUB_API_CLIENT_SECRET")!;
    }
}