import { Inject, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { GithubOAuth2Options } from "../github.oauth2.options";
import { from, map, mergeMap, Observable, tap } from "rxjs";
import { GithubAccountDTO } from "../dto";
import { plainToInstanceOrReject } from "../../utils";

@Injectable()
export class GithubOAuth2Service {
    private readonly _logger: Logger = new Logger(GithubOAuth2Service.name);

    constructor(
       @Inject(HttpService)
       private readonly _httpService: HttpService,
       @Inject(GithubOAuth2Options)
       private readonly _options: GithubOAuth2Options,
    ) {}

    loadAccount(code: string): Observable<GithubAccountDTO> {
        return this.getAccessToken(code)
            .pipe(
                tap(token => {
                    this._logger.debug(token);
                }),
                mergeMap(token => this.getUser(token)),
                tap(data => {
                    this._logger.debug(data);
                }),
                mergeMap(data =>
                    from(plainToInstanceOrReject(
                        GithubAccountDTO, data,
                        { transform: { excludeExtraneousValues: true }, }
                    ))
                )
            );
    }

    private getAccessToken(code: string): Observable<string> {
        return this._httpService
            .post(
                this._options.tokenUrl,
                {
                    "client_id": this._options.clientId,
                    "client_secret": this._options.clientSecret,
                    "code": code,
                    "redirect_uri": this._options.redirectUrl
                },
                {
                    headers: {
                        Accept: "application/json;charset=UTF-8",
                    }
                }
            ).pipe(
                map(({ data }): string =>
                    data["access_token"]
                )
            );
    }

    private getUser(accessToken: string): Observable<any> {
        return this._httpService.get(
            this._options.userUrl,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json;charset=UTF-8"
                }
            }
        ).pipe(
            map(({ data }) => data)
        );
    }
}

