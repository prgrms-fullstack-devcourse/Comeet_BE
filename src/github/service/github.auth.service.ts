import { Inject, Injectable } from "@nestjs/common";
import { GithubOptions } from "../github.options";
import { GenerateTokenService } from "./generate.token.service";
import { GenerateTokenDTO, GithubAccountDTO } from "../dto";
import { firstValueFrom } from "rxjs";
import { TokenPair } from "../../utils";
import { GithubClientService } from "./github.client.service";
import { GithubTokensStorage } from "../github.tokens.storage";
import { GitHubAccountsService } from "./github.accounts.service";

@Injectable()
export class GithubAuthService {

    constructor(
        @Inject(GithubTokensStorage)
        private readonly _tokensStorage: GithubTokensStorage,
        @Inject(GenerateTokenService)
        private readonly _generateTokenService: GenerateTokenService,
        @Inject(GithubClientService)
        private readonly _githubClientService: GithubClientService,
        @Inject(GitHubAccountsService)
        private readonly _githubAccountsService: GitHubAccountsService,
        @Inject(GithubOptions)
        private readonly _options: GithubOptions,
    ) {}

    async login(code: string): Promise<string> {
        const tokens = await this.generateTokenPair({ code });

        const account = await this._githubClientService.sendRequestAsync({
            path: "user",
            accessToken: tokens.accessToken,
            cls: GithubAccountDTO
        });

        await this._tokensStorage.saveTokenPair(account.id, tokens);
        await this._githubAccountsService.saveGithubAccount(account);

        return account.id;
    }

    private generateTokenPair(
        cert: Pick<GenerateTokenDTO, "code" | "refreshToken">
    ): Promise<TokenPair> {
        return firstValueFrom(
            this._generateTokenService.generateToken(
                new GenerateTokenDTO({
                    clientId: this._options.clientId,
                    clientSecret: this._options.clientSecret,
                    ...cert
                })
            )
        );
    }


}