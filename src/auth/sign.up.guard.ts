import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { SignUpSessionService } from "./service";

@Injectable()
export class SignUpGuard implements CanActivate {

    constructor(
       @Inject(SignUpSessionService)
       private readonly _session: SignUpSessionService,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<Request>();
        req.user = await this._session.get(__extract(req));
        return true;
    }
}

function __extract(req: Request): string {
    const sessionId = req.query.sessionId;

    if (!sessionId || typeof sessionId !== "string")
        throw new UnauthorizedException();

    return sessionId;
}