import { CanActivate, ExecutionContext, ForbiddenException, Inject } from "@nestjs/common";
import { firstValueFrom, from, map, mergeMap } from "rxjs";
import { Request } from "express";
import { GithubOAuth2Service, GithubService } from "./service";

export class GithubOAuth2Guard implements CanActivate {

    constructor(
       @Inject(GithubOAuth2Service)
       private readonly _githubOAuth2Service: GithubOAuth2Service,
       @Inject(GithubService)
       private readonly _githubService: GithubService
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<Request>();
        const code = __extractCode(req);

        req.user = await firstValueFrom(
            this._githubOAuth2Service.loadAccount(code)
                .pipe(
                    mergeMap(account =>
                        from(this._githubService.upsertGithubAccount(account))
                    ),
                    map(githubId => ({ githubId }))
                )
        );

        return true;
    }
}

function __extractCode(req: Request): string {
    const code = req.query.code;

    if (!code || typeof code !== "string")
        throw new ForbiddenException();

    return code;
}