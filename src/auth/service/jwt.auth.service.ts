import { ForbiddenException, Inject, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtOptions } from "../jwt.options";
import { randomBytes } from "node:crypto";
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

    generateAccess(id: number): string {
        return this.generateToken(id, this._options.accessExp);
    }

    generateRefresh(id: number): string {
        return this.generateToken(id, this._options.refreshExp);
    }

    async verifyToken(token: string): Promise<TokenPayload> {

        const plain = await this._jwtService.verifyAsync(
            token, { secret: this._options.secret }
        );

        return plainToInstanceOrReject(
            TokenPayload, plain
        ).catch(err => {
            this._logger.error(err);
            throw new ForbiddenException();
        })
    }

    private generateToken(id: number, ex: number): string {
        return this._jwtService.sign(
            { id, salt: randomBytes(16).toString("base64") },
            { secret: this._options.secret, expiresIn: ex / 1000 },
        );
    }
}