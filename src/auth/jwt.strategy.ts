import { Inject, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { JwtOptions } from "./jwt.options";
import { TokenPayload } from "./dto";
import { Request } from "express";
import Redis from "iovalkey";
import { pick } from "../utils/object";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    private readonly _logger: Logger = new Logger(JwtStrategy.name);

    constructor(
        @Inject(Redis)
        private readonly _redis: Redis,
        @Inject(JwtOptions)
        { secret }: JwtOptions
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            passReqToCallback: true
        })
    }

    async validate(
        req: Request,
        payload: TokenPayload,
        done: VerifiedCallback
    ): Promise<void> {
        this._logger.log(req);
        const { authorization } = req.headers;

        if (await this._redis.get(authorization!)) {
            return done(null, false);
        }

        done(null, pick(payload, ["id", "githubId"]));
    }
}