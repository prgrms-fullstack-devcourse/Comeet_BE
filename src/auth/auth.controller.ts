import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Headers,
    Inject,
    Post,
    Res,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse, ApiOkResponse,
    ApiOperation, ApiResponse,
    ApiTags, ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import { AuthService } from "./service";
import { SignInFailResponse, SignInResponse, SignUpBody } from "./api";
import { Cookies, TokenPair, User } from "../utils";
import { SignInInterceptor, SignOutInterceptor } from "./interceptor";
import { Response } from "express";
import { GithubOAuth2Guard } from "../github/github.oauth2.guard";

@ApiTags("Auth")
@Controller("/api/auth")
export class AuthController {

    constructor(
       @Inject(AuthService)
       private readonly _authService: AuthService,
    ) {}

    @Post("/sign-up")
    @ApiOperation({ summary: "회원가입" })
    @ApiBody({ type: SignUpBody, required: true })
    @ApiCreatedResponse({ type: SignInResponse })
    @ApiForbiddenResponse({ description: "등록되지 않은 깃허브 아이디" })
    @ApiConflictResponse({ description: "해당 깃허브 계정으로 가입한 유저 존재" })
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 request body" })
    @UseInterceptors(SignInInterceptor)
    async signUp(
        @Body() body: SignUpBody
    ): Promise<TokenPair> {
        const { email, instagram, linkedIn, blog, ...rest } = body;

        return await this._authService.signUp(Object.assign(
            rest, { social: { email, instagram, linkedIn, blog } }
        ));
    }

    @Get("/sign-in")
    @ApiOperation({ summary: "로그인" })
    @ApiOkResponse({ type: SignInResponse })
    @ApiResponse({ status: 210, type: SignInFailResponse })
    @ApiForbiddenResponse({ description: "github 인증 실패" })
    @UseInterceptors(SignInInterceptor)
    @UseGuards(GithubOAuth2Guard)
    async signIn(
        @User("githubId")
        githubId: string,
        @Res({ passthrough: true })
        res: Response,
    ): Promise<TokenPair | SignInFailResponse> {
        return await this._authService.signIn(githubId)
            .catch(err => {

                if (err instanceof ForbiddenException) {
                    res.status(210)
                    return { githubId };
                }

                throw err;
            });
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
    @ApiOkResponse({ type: SignInResponse })
    @ApiForbiddenResponse({ description: "리프레시 토큰 만료" })
    async renew(
        @Cookies("REFRESH_TOKEN")
        refreshToken?: string,
    ): Promise<SignInResponse> {
        if (!refreshToken) throw new ForbiddenException();
        const accessToken = await this._authService.renew(refreshToken);
        return { accessToken };
    }
}
