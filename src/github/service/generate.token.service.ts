import { Inject, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { GenerateTokenDTO, GenerateTokenResult } from "../dto";
import { from, mergeMap, Observable } from "rxjs";
import { instanceToPlain } from "class-transformer";
import { plainToInstanceOrReject } from "../../utils";
import { AxiosResponse } from "axios";

const __TOKEN_URL = "https://github.com/login/oauth/access_token";

@Injectable()
export class GenerateTokenService {
    private readonly _logger: Logger = new Logger(GenerateTokenService.name);

    constructor(
        @Inject(HttpService)
        private readonly _httpService: HttpService,
    ) {}

    generateToken(dto: GenerateTokenDTO): Observable<GenerateTokenResult> {
        return this.sendRequest(dto).pipe(
            mergeMap(({ data }) => {
                this._logger.debug(data);

                return from(plainToInstanceOrReject(
                    GenerateTokenResult,
                    data,
                    {
                        transform: { excludeExtraneousValues: true },
                        validate: { forbidUnknownValues: false },
                    },
                ));
            })
        );
    }

    private sendRequest(dto: GenerateTokenDTO): Observable<AxiosResponse> {
       Object.setPrototypeOf(dto, GenerateTokenDTO.prototype);

        return this._httpService.post(
            __TOKEN_URL,
            {},
            {
                params: instanceToPlain(dto),
                headers: { Accept: "application/json" }
            }
        );
    }
}