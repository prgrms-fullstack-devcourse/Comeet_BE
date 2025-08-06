import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Inject,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { Request } from "express";
import { SignUpSession } from "./sign.up.session";

@Injectable()
export class SignUpGuard implements CanActivate {

    constructor(
       @Inject(SignUpSession)
       private readonly _session: SignUpSession,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<Request>();
        const data = await this._session.get(__extract(req));

        if (!data) throw new HttpException("Session expired", 440);

        req.user = data;
        return true;
    }
}

function __extract(req: Request): string {
    const sessionId = req.query.sessionId;

    if (!sessionId || typeof sessionId !== "string")
        throw new UnauthorizedException();

    return sessionId;
}