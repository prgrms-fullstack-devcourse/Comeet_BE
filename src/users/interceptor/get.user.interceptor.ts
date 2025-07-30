import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { UserDTO } from "../dto";

@Injectable()
export class GetUserInterceptor
    implements NestInterceptor<UserDTO, object>
{

    intercept(_: ExecutionContext, next: CallHandler<UserDTO>): Observable<object> {
        return next.handle().pipe(
            map(transformBirthyearToAge)
        );
    }
}