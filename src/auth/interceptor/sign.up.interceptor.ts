import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class SignUpInterceptor implements NestInterceptor {

    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        const req = ctx.switchToHttp().getRequest<Request>();

        if (req.body && typeof req.body === "object") {
            const { age, ...rest } = req.body;

            if (typeof age === "number") {
                const birthyear = new Date().getFullYear() - age + 1;
                req.body = { birthyear, ...rest };
            }
        }

        return next.handle();
    }
}