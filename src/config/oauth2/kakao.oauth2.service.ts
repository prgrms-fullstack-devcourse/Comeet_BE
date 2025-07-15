import { Inject, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { plainToInstance } from "class-transformer";
import { KakaoUserInfo, OAuth2UserInfo } from "./data";
import { validateOrReject } from "class-validator";
import { KakaoOAuth2Options } from "./kakao.oauth2.options";
import { OAuth2Options } from "./data/oauth2.options";
import { pipe, tap } from "@fxts/core";

@Injectable()
export class KakaoOAuth2Service {
    private readonly _logger: Logger = new Logger(KakaoOAuth2Service.name);

    constructor(
        @Inject(HttpService)
        private readonly _httpService: HttpService,
        @Inject(KakaoOAuth2Options)
        private readonly _options: OAuth2Options
    ) {}

    async loadUserInfo(code: string): Promise<OAuth2UserInfo> {

        const { id, kakaoAccount } = await this.getAccessToken(code)
            .then(token => this.getKakaoUserInfo(token))
            .catch(err => { throw err; });

        const openId = `kakao-${id}`;
        const { email, profile: { nickname: name } } = kakaoAccount;

        return { name, email };
    }

    private async getAccessToken(code: string): Promise<string> {

        const { data: { access_token: accessToken } } = await this._httpService.axiosRef.post(
            this._options.tokenURL,
            {
                grant_type: "authorization_code",
                client_id: this._options.clientId,
                redirect_uri: this._options.callbackURL,
                code: code
            },
            { headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" }, }
        );

        return accessToken;
    }

    private async getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfo> {

        const { data } = await this._httpService.axiosRef.get(
            this._options.userInfoURL,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type":  "application/x-www-form-urlencoded;charset=UTF-8"
                },
                params: {
                   property_keys: JSON.stringify(["kakao_account.email","kakao_account.profile"])
                }
            }
        );

        return pipe(
            plainToInstance(KakaoUserInfo, data),
            tap(ui => validateOrReject(ui))
        );
    }
}

function __catchAxiosError(err: any) {
    if (!err.response) throw err;

}