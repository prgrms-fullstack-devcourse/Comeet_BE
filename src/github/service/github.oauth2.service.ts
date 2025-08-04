import { Inject, Injectable } from "@nestjs/common";
import { GenerateTokenService } from "./generate.token.service";
import { GetUserService } from "./get.user.service";
import { GithubUserDTO } from "../dto";
import { GithubOptions } from "../github.options";

@Injectable()
export class GithubOAuth2Service {

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
        return this._generateTokenService
            .generateToken({ code, ...this._options })
            .then(({ accessToken }) =>
                this._getUserService.getUser(accessToken)
            )
            .catch(err => { throw err; });
    }

}