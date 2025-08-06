import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { catchError, from, mergeMap, Observable } from "rxjs";
import { SignInResponse } from "../api";
import { GithubUserDTO } from "../../github/dto";
import { SignUpSessionService } from "../service";
import { JwtOptions } from "../jwt.options";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { SignInResult } from "../dto";

@Injectable()
export class SignInInterceptor implements NestInterceptor<
    SignInResult | GithubUserDTO,
    SignInResponse
> {
    private readonly _logger: Logger = new Logger(SignInInterceptor.name);
    private readonly _refreshExp: number;
    private readonly _secure: boolean;

    constructor(
       @Inject(SignUpSessionService)
       private readonly _session: SignUpSessionService,
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
        next: CallHandler<SignInResult | GithubUserDTO>
    ): Observable<SignInResponse> {
        const res = ctx.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
           mergeMap(data => from(this.handle(res, data))),
           catchError(err => {
               this._logger.error(err);
               throw err;
           })
        );
    }

    private async handle(
        res: Response,
        data: SignInResult | GithubUserDTO
    ): Promise<SignInResponse> {

        if (data instanceof SignInResult) {
            const { refreshToken, ...result } = data;

            res.cookie(
                "REFRESH_TOKEN", refreshToken,
                {
                    httpOnly: true,
                    maxAge: this._refreshExp,
                    secure: this._secure,
                    sameSite: "lax"
                },
            );

            return { result, sessionId: null };
        }
        else {
            const sessionId = await this._session.create(data);
            return { result: null, sessionId };
        }

    }

}
