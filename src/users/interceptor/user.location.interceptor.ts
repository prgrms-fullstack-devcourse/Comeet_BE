import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { GetUserInfoService } from "../service";

@Injectable()
export class UserLocationInterceptor implements NestInterceptor {

    constructor(
        @Inject(GetUserInfoService)
        private readonly _getUserInfoService: GetUserInfoService,
    ) {}

    async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = ctx.switchToHttp().getRequest();

        const { location } = await this._getUserInfoService
            .getUserInfo(req.user.id, ["location"]);

        req.user.location = location;
        return next.handle();
    }
}