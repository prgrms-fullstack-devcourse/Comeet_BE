import { Inject, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { from, map, mergeMap, Observable } from "rxjs";
import { GithubUserDTO } from "../dto";
import { plainToInstanceOrReject } from "../../utils";

const __USER_URL = "https://api.github.com/user";

@Injectable()
export class GetUserService {

    constructor(
       @Inject(HttpService)
       private readonly _httpService: HttpService,
    ) {}

    getUser(accessToken: string): Observable<GithubUserDTO> {
        return this._httpService.get(
            __USER_URL,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        ).pipe(
            map(({ data }) => data),
            mergeMap(data =>
                from(plainToInstanceOrReject(
                    GithubUserDTO,
                    data,
                    {
                        transform: { excludeExtraneousValues: true },
                        validate: { forbidUnknownValues: false }
                    }
                ))
            )
        );
    }
}