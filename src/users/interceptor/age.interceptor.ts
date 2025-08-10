import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import type { Request } from "express";
import { transformAgeToBirthyear } from "./interceptor.internal";

@Injectable()
export class AgeInterceptor implements NestInterceptor {

    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        const req: Request = ctx.switchToHttp().getRequest();

        if (req.body & req.body.age && typeof req.body.age === "number")
            req.body = transformAgeToBirthyear(req.body);

        return next.handle();
    }

}