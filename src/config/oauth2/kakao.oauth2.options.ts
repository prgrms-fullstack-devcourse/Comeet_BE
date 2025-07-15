import { Inject, Injectable } from "@nestjs/common";
import { OAuth2Options } from "./data/oauth2.options";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class KakaoOAuth2Options implements OAuth2Options {
    readonly tokenURL: string;
    readonly userInfoURL: string;
    readonly clientId: string;
    readonly clientSecret?: string;
    readonly callbackURL: string;

    constructor(
       @Inject(ConfigService)
       config: ConfigService,
    ) {
        this.tokenURL = config.get<string>("OAUTH2_KAKAO_TOKEN_URL")!;
        this.userInfoURL = config.get<string>("OAUTH2_KAKAO_USER_INFO_URL")!;
        this.clientId = config.get<string>("OAUTH2_KAKAO_CLIENT_ID")!;
        this.clientSecret = config.get<string>("OAUTH2_KAKAO_CLIENT_SECRET");
        this.callbackURL = config.get<string>("OAUTH2_KAKAO_CALLBACK_URL")!;
    }
}