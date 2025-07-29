import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { GetUserLocationService } from "./service/get.user.location.service";

@Injectable()
export class LocationGuard implements CanActivate {

    constructor(
       @Inject(GetUserLocationService)
       private readonly _getUserLocationService: GetUserLocationService,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();
        req.user.location = await this._getUserLocationService.getLocation(req.user);
        return true;
    }
}