import { Inject, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifiedCallback } from "passport-custom";
import { Request } from "express";
import { GithubOAuth2Service } from "./service";
import { AxiosError } from "axios";
import { AxiosException } from "../utils/axios";

@Injectable()
export class GithubOAuth2Strategy extends PassportStrategy(Strategy, "github") {
    private readonly _logger: Logger = new Logger(GithubOAuth2Strategy.name);

    constructor(
        @Inject(GithubOAuth2Service)
        private readonly _githubOAuth2Service: GithubOAuth2Service,
    ) { super(); }

    async validate(req: Request, done: VerifiedCallback): Promise<void> {
        const code = __extractCode(req);
        if (!code) return done(null, false);

        await this._githubOAuth2Service.loadGithubUser(code)
            .then(user => done(null, user))
            .catch(err => {

                const error = err instanceof AxiosError
                    ? AxiosException.fromAxiosError(err)
                    :err;

                this._logger.error(error);
                done(error, false);
            });
    }

}

function __extractCode(req: Request): string| null {
    const code = req.query.code;
    if (!code || typeof code !== "string") return null;
    return code;
}