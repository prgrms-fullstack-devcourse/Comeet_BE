import { Inject, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosError } from "axios";
import { catchError, firstValueFrom, from, map, mergeMap, Observable } from "rxjs";
import { SendRequestDTO } from "../dto";
import { plainToInstanceOrReject } from "../../utils";
import { instanceToPlain } from "class-transformer";

const __BASE_URL = "https://api.github.com";

@Injectable()
export class GithubClientService {
    private readonly _logger: Logger = new Logger(GithubClientService.name);

    constructor(
       @Inject(HttpService)
       private readonly _httpService: HttpService,
    ) {}

    sendRequest<R extends object = any>(dto: SendRequestDTO<R>): Observable<R> {
        const { path, accessToken, params, cls } = dto;

        return this._httpService.get(
            `${__BASE_URL}/${path}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: params && instanceToPlain(params)
            }
        ).pipe(
            map(({ data }) => data),
            mergeMap(data =>
                from(
                    plainToInstanceOrReject(
                        cls, data,
                        { transform: { excludeExtraneousValues: true } }
                    )
                ),
            ),
            catchError(err => {
                this.handleIfAxiosError(err);
                throw err;
            })
        )
    }

    sendRequestAsync<R extends object = any>(dto: SendRequestDTO<R>): Promise<R> {
        return firstValueFrom(this.sendRequest(dto));
    }

    private handleIfAxiosError(err: any) {

       if (err instanceof AxiosError) {
           this._logger.error({
               status: err.response?.status,
               statusText: err.response?.statusText,
               data: err.response?.data,
           });

           throw Error("Github Client Error");
       }
    }
}