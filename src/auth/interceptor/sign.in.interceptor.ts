import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { catchError, from, mergeMap, Observable, tap } from "rxjs";
import { SignInResponse } from "../api";
import { GithubUserDTO } from "../../github/dto";
import { SignUpSession } from "../sign.up.session";
import { JwtOptions } from "../jwt.options";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { TokenPair } from "../../utils";

@Injectable()
export class SignInInterceptor implements NestInterceptor<
    TokenPair | GithubUserDTO,
    SignInResponse
> {
    private readonly _logger: Logger = new Logger(SignInInterceptor.name);
    private readonly _refreshExp: number;
    private readonly _secure: boolean;

    constructor(
       @Inject(SignUpSession)
       private readonly _session: SignUpSession,
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
        next: CallHandler<TokenPair | GithubUserDTO>
    ): Observable<SignInResponse> {
        const res = ctx.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
           tap(data => this._logger.debug(data)),
           mergeMap(data => from(this.handle(res, data))),
           catchError(err => {
               this._logger.error(err);
               throw err;
           })
        );
    }

    private async handle(
        res: Response,
        data: TokenPair | GithubUserDTO
    ): Promise<SignInResponse> {

        if (data instanceof TokenPair) {
            const { accessToken, refreshToken } = data;

            res.cookie(
                "REFRESH_TOKEN", refreshToken,
                {
                    httpOnly: true,
                    maxAge: this._refreshExp,
                    secure: this._secure,
                    sameSite: "lax"
                },
            );

            return { accessToken, sessionId: null };
        }
        else {
            const sessionId = await this._session.create(data);
            return { accessToken: null, sessionId };
        }

    }

}
