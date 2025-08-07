import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../../users";
import { JwtAuthService } from "./jwt.auth.service";
import { SignInResult, SignUpDTO, TokenPair } from "../dto";
import { pick } from "../../utils";
import { Transactional } from "typeorm-transactional";
import { GithubUserDTO } from "../../github/dto";
import { SignUpSessionService } from "./sign.up.session.service";

@Injectable()
export class AuthService {

    constructor(
       @Inject(UsersService)
       private readonly _usersService: UsersService,
       @Inject(JwtAuthService)
       private readonly _jwtAuthService: JwtAuthService,
       @Inject(SignUpSessionService)
       private readonly _signUpSessionService: SignUpSessionService,
    ) {}

    async signUp(dto: SignUpDTO): Promise<SignInResult> {
        const id = await this._usersService.createUser(dto);
        const tokens = this.generateTokenPair(id);
        return { ...tokens, ...pick(dto, ["nickname", "avatar"]) };
    }

    @Transactional()
    async signIn(dto: GithubUserDTO): Promise<SignInResult | string> {
        const { githubId, avatar, github } = dto;

        try {
            const { id, nickname } = await this._usersService.getUserIdentification(githubId);
            await this._usersService.updateUser({ id, avatar, github });
            const tokens = this.generateTokenPair(id);
            return { nickname, avatar, ...tokens };
        }
        catch (err) {

            if (err instanceof ForbiddenException) {
                return this._signUpSessionService
                    .create(dto);
            }

            throw err;
        }
    }


    async renew(refreshToken: string): Promise<string> {
        const { id } = await this._jwtAuthService.verifyToken(refreshToken);
        return this._jwtAuthService.generateAccess(id);
    }

    private generateTokenPair(id: number): TokenPair {
        const accessToken = this._jwtAuthService.generateAccess(id);
        const refreshToken = this._jwtAuthService.generateRefresh(id);
        return { accessToken, refreshToken };
    }


}