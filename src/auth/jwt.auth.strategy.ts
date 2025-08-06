import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { JwtOptions } from "./jwt.options";
import { Request } from "express";
import { TokenPayload } from "./dto";
import { pick } from "../utils";
import { BlacklistService } from "./service";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, "jwt") {

    constructor(
        @Inject(BlacklistService)
        private readonly _blacklist: BlacklistService,
        @Inject(JwtOptions)
        { secret }: JwtOptions,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            passReqToCallback: true
        });
    }

    async validate(
        req: Request,
        payload: TokenPayload,
        done: VerifiedCallback
    ): Promise<void> {
        const exists = await this._blacklist.exists(req.headers.authorization!);
        if (exists) done(null, false);
        else  done(null, pick(payload, ["id"]));
    }
}