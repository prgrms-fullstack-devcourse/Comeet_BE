import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { from, map, mergeMap, Observable, toArray } from "rxjs";
import { SearchUserResult } from "../dto";
import { transformBirthyearToAge } from "./interceptor.internal";
import type { Request } from "express";

type __ResponseT = { results: object[] };

@Injectable()
export class SearchUsersInterceptor
    implements NestInterceptor<
        SearchUserResult[],
        __ResponseT
> {

    intercept(
        ctx: ExecutionContext,
        next: CallHandler<SearchUserResult[]>
    ): Observable<__ResponseT> {
        const req: Request = ctx.switchToHttp().getRequest();

        if (req.query) {
            const { age, ...rest } = req.query;

            if (age && typeof age === "string") {

                const birthyear = age
                    .split('-')
                    .reverse()
                    .join('-');

                req.query = { birthyear, ...rest };
            }
        }

        return next.handle().pipe(
            mergeMap(data => from(data)),
            map(transformBirthyearToAge),
            toArray(),
            map(results => ({ results }))
        );

    }

}

