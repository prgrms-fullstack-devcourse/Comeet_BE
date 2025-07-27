import { ForbiddenException, Inject, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtOptions } from "../jwt.options";
import { UserDTO } from "../../users/dto";
import * as crypto from "node:crypto";
import { plainToInstanceOrReject } from "../../utils";
import { TokenPayload } from "../dto";

@Injectable()
export class JwtAuthService {
    private readonly _logger: Logger = new Logger(JwtAuthService.name);

    constructor(
       @Inject(JwtService)
       private readonly _jwtService: JwtService,
       @Inject(JwtOptions)
       private readonly _options: JwtOptions,
    ) {}

    generateAccess(user: UserDTO): string {
        return this.generateToken(user, this._options.accessExp);
    }

    generateRefresh(user: UserDTO): string {
        return this.generateToken(user, this._options.refreshExp);
    }

    async verifyToken(token: string): Promise<UserDTO> {

        const { id, githubId } = await this._jwtService.verifyAsync(
            token, { secret: this._options.secret }
        ).then(data =>
            plainToInstanceOrReject(TokenPayload, data)
        ).catch(err => {
            this._logger.error(err);
            throw new ForbiddenException();
        });

        return { id, githubId };
    }

    private generateToken(
        user: UserDTO,
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