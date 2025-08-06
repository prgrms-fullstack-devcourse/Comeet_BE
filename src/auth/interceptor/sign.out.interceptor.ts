import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Request, Response } from "express";

@Injectable()
export class SignOutInterceptor implements NestInterceptor<void, void> {


    intercept(ctx: ExecutionContext, next: CallHandler<void>): Observable<void> {
        const req = ctx.switchToHttp().getRequest<Request>();
        const res = ctx.switchToHttp().getResponse<Response>();



        return next.handle().pipe(
            tap(() => {
                res.clearCookie("REFRESH_TOKEN");
            })
        );
    }
}