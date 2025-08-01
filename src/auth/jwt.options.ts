import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtOptions {
    readonly secret: string;
    readonly accessExp: number;
    readonly refreshExp: number;

    constructor(
        @Inject(ConfigService)
        config: ConfigService
    ) {
        this.secret = config.get<string>("JWT_SECRET")!;
        this.accessExp = config.get<number>("JWT_ACCESS_EXP")!;
        this.refreshExp = config.get<number>("JWT_REFRESH_EXP")!;
    }
}