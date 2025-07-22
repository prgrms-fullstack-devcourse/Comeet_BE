import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, Logger } from "@nestjs/common";
import { GithubAuthService } from "./service";
import { Request } from "express";

@Injectable()
export class GithubOAuth2Guard implements CanActivate {
    private readonly _logger: Logger = new Logger(GithubOAuth2Guard.name);

    constructor(
       @Inject(GithubAuthService)
       private readonly _githubAuthService: GithubAuthService
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<Request>();

        await this._githubAuthService.login(
            __extractCode(req)
        ).then(githubId =>
            req.user = { githubId }
        ).catch(err => {
            this._logger.error(err);
            throw new ForbiddenException();
        });

        return true;
    }
}

function __extractCode(req: Request): string {
    const code = req.query.code;
    if (!code || typeof code !== "string") throw new ForbiddenException();
    return code;
}