import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Headers,
    Inject,
    Post, Res,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse, ApiOkResponse,
    ApiOperation, ApiQuery, ApiResponse,
    ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "./service";
import { RenewResponse, SignInQuery, SignInResponse, SignUpBody, SignUpQuery } from "./api";
import { Cookies, User } from "../utils";
import { SignInInterceptor, SignOutInterceptor } from "./interceptor";
import { AuthGuard } from "@nestjs/passport";
import { GithubUserDTO } from "../github/dto";
import { SignUpGuard } from "./sign.up.guard";
import { JwtOptions } from "./jwt.options";
import { ConfigService } from "@nestjs/config";

@ApiTags("Auth")
@Controller("/api/auth")
export class AuthController {
    private readonly _refreshExp: number;
    private readonly _secure: boolean;

    constructor(
       @Inject(AuthService)
       private readonly _authService: AuthService,
       @Inject(JwtOptions)
       { refreshExp }: JwtOptions,
       @Inject(ConfigService)
       config: ConfigService,
    ) {
        this._refreshExp = refreshExp;
        this._secure = config.get("NODE_ENV") !== "dev";
    }

    @Post("/sign-up")
    @ApiOperation({ summary: "회원가입" })
    @ApiQuery({ type: SignUpQuery, required: true })
    @ApiBody({ type: SignUpBody, required: true })
    @ApiCreatedResponse({ type: SignInResponse })
    @ApiUnauthorizedResponse({ description: "세션 아이디 쿼리에 첨부하지 않음" })
    @ApiConflictResponse({ description: "해당 깃허브 계정으로 가입한 유저 존재" })
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 request body" })
    @ApiResponse({ status: 440, description: "회원가입 세션 만료됨" })
    @UseInterceptors(SignInInterceptor)
    @UseGuards(SignUpGuard)
    async signUp(
        @User() { githubId, githubLink }: GithubUserDTO,
        @Body() body: SignUpBody,
        @Res({ passthrough: true })
        res: Response,
    ): Promise<string> {

        const { accessToken, refreshToken }
            = await this._authService.signUp({
            ...body, githubId,
            github: githubLink,
        });

        this.saveRefreshToken(res, refreshToken);
        return accessToken;
    }

    @Get("/sign-in")
    @ApiOperation({ summary: "로그인" })
    @ApiQuery({ type: SignInQuery, required: true })
    @ApiOkResponse({ type: SignInResponse })
    @ApiForbiddenResponse({ description: "github 인증 실패" })
    @UseInterceptors(SignInInterceptor)
    @UseGuards(AuthGuard("github"))
    async signIn(
        @User()
        user: GithubUserDTO,
        @Res({ passthrough: true })
        res: Response,
    ): Promise<string | GithubUserDTO> {
        try {
            const { accessToken, refreshToken }
                = await this._authService.signIn(user.githubId);

            this.saveRefreshToken(res, refreshToken);
            return accessToken;
        }
        catch (err) {

            if (err instanceof ForbiddenException)
                return user;

            throw err;
        }
    }

    @Get("/sign-out")
    @ApiOperation({ summary: "로그아웃" })
    @ApiBearerAuth()
    @ApiOkResponse()
    @UseInterceptors(SignOutInterceptor)
    async signOut(
       @Headers("authorization")
       authorization: string
    ): Promise<void> {
       authorization
       && await this._authService.signOut(authorization);
    }

    @Get("/renew")
    @ApiOperation({ summary: "액세스 토큰 재발급" })
    @ApiOkResponse({ type: RenewResponse })
    @ApiForbiddenResponse({ description: "리프레시 토큰 만료" })
    async renew(
        @Cookies("REFRESH_TOKEN")
        refreshToken?: string,
    ): Promise<RenewResponse> {
        if (!refreshToken) throw new ForbiddenException();
        const accessToken = await this._authService.renew(refreshToken);
        return { accessToken };
    }

    private saveRefreshToken(
        res: Response,
        refreshToken: string,
    ): void {
        res.cookie(
            "REFRESH_TOKEN", refreshToken,
            {
                httpOnly: true,
                maxAge: this._refreshExp,
                secure: this._secure,
                sameSite: "lax"
            },
        );
    }
}
