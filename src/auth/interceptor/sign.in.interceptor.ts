import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { catchError, from, mergeMap, Observable, tap } from "rxjs";
import { SignInResponse } from "../api";
import { GithubUserDTO } from "../../github/dto";
import { SignUpSession } from "../sign.up.session";

@Injectable()
export class SignInInterceptor implements NestInterceptor<
    string | GithubUserDTO,
    SignInResponse
> {
    private readonly _logger: Logger = new Logger(SignInInterceptor.name);

    constructor(
       @Inject(SignUpSession)
       private readonly _session: SignUpSession,
    ) {}

    intercept(
        _: ExecutionContext,
        next: CallHandler<string | GithubUserDTO>
    ): Observable<SignInResponse> {
        return next.handle().pipe(
           tap(data => this._logger.debug(data)),
           mergeMap(data => from(this.handle(data))),
           catchError(err => {
               this._logger.error(err);
               throw err;
           })
        );
    }

    private async handle(
        data: string | GithubUserDTO
    ): Promise<SignInResponse> {
        let accessToken: string | null = null;
        let sessionId: string | null = null;

        if (data instanceof GithubUserDTO) {
            //sessionId = await this._session.create(data);
        }
        else
            accessToken = data;

        return { accessToken, sessionId };
    }

}
