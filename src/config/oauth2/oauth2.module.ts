import { Module } from "@nestjs/common";
import { KakaoOAuth2Service } from "./kakao.oauth2.service";
import { KakaoOAuth2Guard } from "./kakao.oauth2.guard";
import { KakaoOAuth2Options } from "./kakao.oauth2.options";

@Module({
    providers: [
        KakaoOAuth2Guard,
        KakaoOAuth2Service,
        KakaoOAuth2Options
    ],
    exports: [
        KakaoOAuth2Guard,
        KakaoOAuth2Service,
        KakaoOAuth2Options
    ],
})
export class OAuth2Module {}