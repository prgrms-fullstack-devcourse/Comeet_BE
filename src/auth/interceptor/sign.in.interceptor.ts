import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { from, mergeMap, Observable, tap } from "rxjs";
import { TokenPair } from "../../utils";
import { SignInFailResponse, SignInResponse } from "../api";
import { Response } from "express";
import { JwtOptions } from "../jwt.options";
import { ConfigService } from "@nestjs/config";
import { GithubUserDTO } from "../../github/dto";
import { SignUpSession } from "../sign.up.session";

@Injectable()
export class SignInInterceptor implements NestInterceptor<
    TokenPair | GithubUserDTO,
    SignInResponse | SignInFailResponse
> {
    private readonly _logger: Logger = new Logger(SignInInterceptor.name);
    private readonly _refreshExp: number;
    private readonly _secure: boolean;

    constructor(
       @Inject(SignUpSession)
       private readonly _session: SignUpSession,
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
        next: CallHandler<TokenPair | GithubUserDTO>
    ): Observable<SignInResponse | SignInFailResponse> {

        const res = ctx.switchToHttp()
            .getResponse<Response>();

        return next.handle().pipe(
           tap(data => this._logger.debug(data)),
           mergeMap(data =>
               from(this.handle(res, data))
           ),
           tap(data => this._logger.debug(data)),
        );
    }

    private async handle(
        res: Response,
        data: TokenPair | GithubUserDTO
    ): Promise<SignInResponse | SignInFailResponse> {

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

            return { accessToken };
        }
        else {
            const sessionId = await this._session.create(data);
            res.status(210);
            return { sessionId };
        }

    }

}
