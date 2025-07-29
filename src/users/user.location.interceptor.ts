import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { GetUserLocationService } from "./service";

@Injectable()
export class UserLocationInterceptor implements NestInterceptor {

    constructor(
        @Inject(GetUserLocationService)
        private readonly _getUserLocationService: GetUserLocationService,
    ) {}

    async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = ctx.switchToHttp().getRequest();

        req.user.location = await this._getUserLocationService
            .getLocation({ id: req.user.id });

        return next.handle();
    }
}