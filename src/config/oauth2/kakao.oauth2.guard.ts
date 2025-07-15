import {CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import { Request } from "express";
import { KakaoOAuth2Service } from "./kakao.oauth2.service";

@Injectable()
export class KakaoOAuth2Guard implements CanActivate {
    private readonly _logger: Logger = new Logger(KakaoOAuth2Guard.name);

    constructor(
        @Inject(KakaoOAuth2Service)
        private readonly _kakaoOAuth2Service: KakaoOAuth2Service,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<Request>();

        const code = req.query.code as string;
        this._logger.debug(code);

        req.user = await this._kakaoOAuth2Service.loadUserInfo(code)
            .catch(err => {
                this._logger.error(err);
                throw new UnauthorizedException();
            });

        return true;
    }


}