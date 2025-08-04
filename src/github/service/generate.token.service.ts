import { Inject, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { GenerateTokenDTO, GenerateTokenResult } from "../dto";
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

    async generateToken(dto: GenerateTokenDTO): Promise<GenerateTokenResult>  {
        const { data } = await this.sendRequest(dto);
        this._logger.debug(data);

        return plainToInstanceOrReject(
            GenerateTokenResult,
            data,
            {
                transform: { excludeExtraneousValues: true },
                validate: { forbidUnknownValues: false },
            },
        );
    }

    private sendRequest(dto: GenerateTokenDTO): Promise<AxiosResponse> {
       Object.setPrototypeOf(dto, GenerateTokenDTO.prototype);

        return this._httpService.axiosRef.post(
            __TOKEN_URL,
            {},
            {
                params: instanceToPlain(dto),
                headers: { Accept: "application/json" }
            }
        );
    }
}

