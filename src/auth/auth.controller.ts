import { Controller, ForbiddenException, Get, Headers, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from "./service";
import { JwtOptions } from "./jwt.options";
import { Cookies, User } from "../utils";
import { Response } from "express";
import { GithubOAuth2Guard } from "../github";
import { SignUpDTO, TokenPair } from "./dto";

@Controller('/api/auth')
export class AuthController {
    private readonly _refreshExp: number;

    constructor(
       @Inject(AuthService)
       private readonly _authService: AuthService,
       @Inject(JwtOptions)
       { refreshExp }: JwtOptions
    ) {
        this._refreshExp = refreshExp;
    }

    @Post("/sign-up")
    async signUp(
        @Req() body: SignUpDTO,
        @Res({ passthrough: true })
        res: Response,
    ) {
        return this._authService.signUp(body)
            .then(pair => this.handleSignIn(pair, res))
            .catch(err => { throw err; });
    }

    @Get("/sign-in")
    @UseGuards(GithubOAuth2Guard)
    async signIn(
        @User("githubId")
        githubId: string,
        @Res({ passthrough: true })
        res: Response
    ) {
        return this._authService.signIn(githubId)
            .then(pair => this.handleSignIn(pair, res))
            .catch(err => {

                if (err instanceof ForbiddenException) {
                    res.status(210);
                    return { githubId };
                }

                throw err;
            });
    }

    @Get("/sign-out")
    async signOut(
        @Headers("authorization")
        authorization: string,
        @Res({ passthrough: true })
        res: Response
    ): Promise<void> {
        await this._authService.signOut(authorization);
        res.clearCookie("REFRESH_TOKEN");
    }

    @Get("/renew")
    async renew(
        @Cookies("REFRESH_TOKEN")
        refreshToken: string | undefined
    ) {
        if (!refreshToken) throw new ForbiddenException();
        const accessToken = await this._authService.renew(refreshToken);
        return { accessToken };
    }

    private handleSignIn(tokenPair: TokenPair, res: Response) {
        const { accessToken, refreshToken } = tokenPair;

        res.cookie(
            "REFRESH_TOKEN",
            refreshToken,
            { httpOnly: true, maxAge: this._refreshExp, sameSite: "lax" }
        );

        return { accessToken };
    }
}
