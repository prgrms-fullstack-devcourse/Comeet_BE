import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TokenPair } from "../../utils";
import { SignInResponse } from "../api";
import { Response } from "express";
import { JwtOptions } from "../jwt.options";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SignInInterceptor implements NestInterceptor<TokenPair, SignInResponse> {
    private readonly _logger: Logger = new Logger(SignInInterceptor.name);
    private readonly _refreshExp: number;
    private readonly _secure: boolean;

    constructor(
       @Inject(ConfigService)
       config: ConfigService,
       @Inject(JwtOptions)
       { refreshExp }: JwtOptions,
    ) {
        this._secure = config.get("NODE_ENV") !== "dev";
        this._refreshExp = refreshExp;
    }

    intercept(
        ctx: ExecutionContext,
        next: CallHandler<TokenPair>
    ): Observable<SignInResponse> {

        const res = ctx.switchToHttp()
            .getResponse<Response>();

        return next.handle().pipe(
            map(({ accessToken, refreshToken }): SignInResponse => {
                this._logger.debug(res);

                res.cookie(
                    "REFRESH_TOKEN", refreshToken,
                    {
                        httpOnly: true,
                        maxAge: this._refreshExp,
                        secure: this._secure,
                        sameSite: "lax"
                    },
                );

                return { accessToken };
            })
        );
    }

}