import { Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../../users";
import { JwtAuthService } from "./jwt.auth.service";
import { SignUpDTO } from "../dto";
import { TokenPair } from "../../utils";
import { UserCert } from "../../users/dto";
import { BlacklistService } from "./blacklist.service";

@Injectable()
export class AuthService {

    constructor(
       @Inject(UsersService)
       private readonly _usersService: UsersService,
       @Inject(JwtAuthService)
       private readonly _jwtAuthService: JwtAuthService,
       @Inject(BlacklistService)
       private readonly _blacklist: BlacklistService,
    ) {}

    async signUp(dto: SignUpDTO): Promise<TokenPair> {
        const user = await this._usersService.createUser(dto);
        return this.generateTokenPair(user);
    }

    async signIn(githubId: string): Promise<TokenPair> {
        const user = await this._usersService.getUserCert(githubId);
        return this.generateTokenPair(user);
    }

    async signOut(authorization: string): Promise<void> {
        await this._blacklist.add(authorization);
    }

    async renew(refreshToken: string): Promise<string> {
        const user = await this._jwtAuthService.verifyToken(refreshToken);
        return this._jwtAuthService.generateAccess(user);
    }

    private generateTokenPair(user: UserCert): TokenPair {
        const accessToken = this._jwtAuthService.generateAccess(user);
        const refreshToken = this._jwtAuthService.generateRefresh(user);
        return { accessToken, refreshToken };
    }
}