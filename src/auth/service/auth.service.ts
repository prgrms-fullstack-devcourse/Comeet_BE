import { Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../../users";
import { JwtAuthService } from "./jwt.auth.service";
import { SignInDTO, SignInResult, SignUpDTO } from "../dto";
import { pick } from "../../utils";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class AuthService {

    constructor(
       @Inject(UsersService)
       private readonly _usersService: UsersService,
       @Inject(JwtAuthService)
       private readonly _jwtAuthService: JwtAuthService,
    ) {}

    async signUp(dto: SignUpDTO): Promise<SignInResult> {
        const id = await this._usersService.createUser(dto);
        const [accessToken, refreshToken] = this.generateTokenPair(id);
        return { accessToken, refreshToken, ...pick(dto, ["nickname", "avatar"]) };
    }

    @Transactional()
    async signIn(dto: SignInDTO): Promise<SignInResult> {
        const { githubId, avatar, github } = dto;

        const { id, nickname } = await this._usersService.getUserIdentification(githubId);
        await this._usersService.updateUser({ id, avatar, github });
        const [accessToken, refreshToken] = this.generateTokenPair(id);

        return { nickname, avatar, accessToken, refreshToken };
    }


    async renew(refreshToken: string): Promise<string> {
        const { id } = await this._jwtAuthService.verifyToken(refreshToken);
        return this._jwtAuthService.generateAccess(id);
    }

    private generateTokenPair(id: number): [string, string] {
        const accessToken = this._jwtAuthService.generateAccess(id);
        const refreshToken = this._jwtAuthService.generateRefresh(id);
        return [accessToken, refreshToken];
    }
}