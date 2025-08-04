import { Inject, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { GithubUserDTO } from "../dto";
import { plainToInstanceOrReject } from "../../utils";
import { AxiosResponse } from "axios";

const __USER_URL = "https://api.github.com/user";

@Injectable()
export class GetUserService {
    private readonly _logger: Logger = new Logger(GetUserService.name);

    constructor(
       @Inject(HttpService)
       private readonly _httpService: HttpService,
    ) {}

    async getUser(accessToken: string): Promise<GithubUserDTO> {
        const { data } = await this.sendRequest(accessToken);
        this._logger.debug(data);

        return plainToInstanceOrReject(
            GithubUserDTO,
            data,
            {
                transform: { excludeExtraneousValues: true },
                validate: { forbidUnknownValues: false }
            }
        );
    }

    private sendRequest(accessToken: string): Promise<AxiosResponse> {
        return this._httpService.axiosRef.get(
            __USER_URL,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
    }
}