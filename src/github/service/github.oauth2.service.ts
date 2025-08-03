import { Inject, Injectable, Logger } from "@nestjs/common";
import { GenerateTokenService } from "./generate.token.service";
import { GetUserService } from "./get.user.service";
import { GithubUserDTO } from "../dto";
import { GithubOptions } from "../github.options";
import { firstValueFrom, mergeMap } from "rxjs";

@Injectable()
export class GithubOAuth2Service {
    private readonly _logger: Logger = new Logger(GithubOAuth2Service.name);

    constructor(
       @Inject(GenerateTokenService)
       private readonly _generateTokenService: GenerateTokenService,
       @Inject(GetUserService)
       private readonly _getUserService: GetUserService,
       @Inject(GithubOptions)
       private readonly _options: GithubOptions,
    ) {
    }

    async loadGithubUser(code: string): Promise<GithubUserDTO> {
        return firstValueFrom(
            this._generateTokenService.generateToken({
                ...this._options, code
            }).pipe(
                mergeMap(({ accessToken }) =>{
                    this._logger.debug(accessToken);
                    return this._getUserService.getUser(accessToken);
                })
            )
        );
    }

}