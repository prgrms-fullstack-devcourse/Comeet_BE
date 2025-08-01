import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { from, map, mergeMap, Observable, toArray } from "rxjs";
import { SearchUserResult } from "../dto";
import { transformBirthyearToAge } from "./interceptor.internal";

type __ResponseT = { results: object[] };

@Injectable()
export class SearchUsersInterceptor
    implements NestInterceptor<
        SearchUserResult[],
        __ResponseT
> {

    intercept(
        _: ExecutionContext,
        next: CallHandler<SearchUserResult[]>
    ): Observable<__ResponseT> {
        return next.handle().pipe(
            mergeMap(data => from(data)),
            map(transformBirthyearToAge),
            toArray(),
            map(results => ({ results }))
        );

    }

}

