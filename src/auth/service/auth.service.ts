import { Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../../users";
import { JwtAuthService } from "./jwt.auth.service";
import Redis from "iovalkey";
import { JwtOptions } from "../jwt.options";
import { SignUpDTO } from "../dto";
import { TokenPair } from "../../utils";
import { UserDTO } from "../../users/dto";

@Injectable()
export class AuthService {

    constructor(
       @Inject(UsersService)
       private readonly _usersService: UsersService,
       @Inject(JwtAuthService)
       private readonly _jwtAuthService: JwtAuthService,
       @Inject(Redis)
       private readonly _redis: Redis,
       @Inject(JwtOptions)
       private readonly _options: JwtOptions,
    ) {}

    async signUp(dto: SignUpDTO): Promise<TokenPair> {
        const user = await this._usersService.createUser(dto);
        return this.generateTokenPair(user);
    }

    async signIn(githubId: string): Promise<TokenPair> {
        const user = await this._usersService.getUser({ githubId });
        return this.generateTokenPair(user);
    }

    async signOut(authorization: string): Promise<void> {
        await this._redis.set(
            authorization,
            new Date().toLocaleDateString(),
            "PX",
            this._options.accessExp
        );
    }

    async renew(refreshToken: string): Promise<string> {
        const user = await this._jwtAuthService.verifyToken(refreshToken);
        return this._jwtAuthService.generateAccess(user);
    }

    private generateTokenPair(user: UserDTO): TokenPair {
        const accessToken = this._jwtAuthService.generateAccess(user);
        const refreshToken = this._jwtAuthService.generateRefresh(user);
        return { accessToken, refreshToken };
    }
}