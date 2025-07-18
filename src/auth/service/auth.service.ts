import { Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../../users/service/users.service";
import { JwtAuthService } from "./jwt.auth.service";
import Redis from "iovalkey";
import { SignUpDTO, TokenPair } from "../dto";
import { JwtOptions } from "../jwt.options";

@Injectable()
export class AuthService {
    private readonly _accessExp: number;

    constructor(
       @Inject(UsersService)
       private readonly _usersService: UsersService,
       @Inject(JwtAuthService)
       private readonly _jwtAuthService: JwtAuthService,
       @Inject(Redis)
       private readonly _redis: Redis,
       @Inject(JwtOptions)
       { accessExp }: JwtOptions
    ) {
        this._accessExp = accessExp;
    }

    async signUp(dto: SignUpDTO): Promise<TokenPair> {
        await this._usersService.createUser(dto);
        return this.signIn(dto.githubId);
    }

    async signIn(githubId: string): Promise<TokenPair> {
        const user = await this._usersService.loadUserIdentification({ githubId });

        const accessToken = this._jwtAuthService.issueAccessToken(user);
        const refreshToken = this._jwtAuthService.issueRefreshToken(user);

        return { accessToken, refreshToken };
    }

    async signOut(authorization: string): Promise<void> {
        await this._redis.set(
            authorization,
            new Date().toISOString(),
            "PX", this._accessExp
        );
    }

    async renew(refreshToken: string): Promise<string> {
        const user = await this._jwtAuthService.verifyToken(refreshToken);
        return this._jwtAuthService.issueAccessToken(user);
    }
}