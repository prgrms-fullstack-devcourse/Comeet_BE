import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { SignInResponse } from "../api";
import { JwtOptions } from "../jwt.options";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { SignInResult } from "../dto";

@Injectable()
export class SignInInterceptor implements NestInterceptor<
    SignInResult | string,
    SignInResponse
> {
    private readonly _refreshExp: number;
    private readonly _secure: boolean;

    constructor(
       @Inject(JwtOptions)
       { refreshExp }: JwtOptions,
       @Inject(ConfigService)
       config: ConfigService,
    ) {
        this._refreshExp = refreshExp;
        this._secure = config.get("NODE_ENV") !== "dev";
    }

    intercept(
        ctx: ExecutionContext,
        next: CallHandler<SignInResult | string>
    ): Observable<SignInResponse> {
        const res = ctx.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
           map(data => {

               if (typeof data === "string") {
                   return { sessionId: data, result: null };
               }
               else {
                   const { refreshToken, ...result } = data;
                   this.saveRefreshTokenToCookie(res, refreshToken);
                   return { sessionId: null, result }
               }

           })
        );
    }

    private saveRefreshTokenToCookie(
        res: Response,
        refreshToken: string,
    ): void {
        res.cookie(
            "REFRESH_TOKEN", refreshToken,
            {
                httpOnly: true,
                maxAge: this._refreshExp,
                secure: this._secure,
                sameSite: "lax"
            },
        );
    }


}
