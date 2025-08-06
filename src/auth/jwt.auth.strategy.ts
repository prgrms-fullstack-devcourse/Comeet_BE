import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import Redis from "iovalkey";
import { JwtOptions } from "./jwt.options";
import { Request } from "express";
import { TokenPayload } from "./dto";
import { pick } from "../utils";
import { BlacklistService } from "./service/blacklist.service";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, "jwt") {

    constructor(
        @Inject(BlacklistService)
        private readonly _blacklist: BlacklistService,
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

        // check blacklist
        if (await this._redis.get(req.headers.authorization!))
            return done(null, false);

        done(null, pick(payload, ["id", "githubId"]));
    }
}