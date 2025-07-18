import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtOptions } from "../jwt.options";
import { UserIdentificationDTO } from "../../users/dto";
import * as crypto from "node:crypto";
import { TokenPayload } from "../dto";

@Injectable()
export class JwtAuthService {

    constructor(
       @Inject(JwtService)
       private readonly _jwtService: JwtService,
       @Inject(JwtOptions)
       private readonly _options: JwtOptions
    ) {}

    issueAccessToken(user: UserIdentificationDTO): string {
        return this.issueToken(user, this._options.accessExp);
    }

    issueRefreshToken(user: UserIdentificationDTO): string {
        return this.issueToken(user, this._options.refreshExp);
    }

    async verifyToken(token: string): Promise<UserIdentificationDTO> {
        return this._jwtService.verifyAsync<TokenPayload>(
            token, { secret: this._options.secret }
        ).then(
            ({ id, githubId }) => ({ id, githubId })
        ).catch(err => { throw new ForbiddenException(err); });
    }

    private issueToken(
        user: UserIdentificationDTO,
        exp: number
    ): string {
        return this._jwtService.sign(
            Object.assign(
                user,
                { salt: crypto.randomBytes(16).toString("base64") }
            ),
            { secret: this._options.secret, expiresIn: exp / 1000 },
        );
    }
}