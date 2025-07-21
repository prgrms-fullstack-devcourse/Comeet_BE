import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UserInterest, UserTech } from "../users/model";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { GithubAccount } from "../github/model";
import { GithubModule } from "../github";
import { GithubOAuth2Guard } from "../github/github.oauth2.guard";
import { JwtAuthStrategy } from "./jwt.auth.strategy";
import { JwtOptions } from "./jwt.options";
import { AuthService, JwtAuthService } from "./service";
import { SignInInterceptor, SignOutInterceptor } from "./interceptor";
import { UsersModule, UsersService } from "../users";

const __EXTERNAL_PROVIDERS = [
    JwtService,
    GithubOAuth2Guard,
    UsersService
];

@Module({
  imports: [
      TypeOrmModule.forFeature([
          User, UserTech, UserInterest, GithubAccount
      ]),
      PassportModule.register({}),
      JwtModule.register({}),
      GithubModule,
      UsersModule
  ],
  providers: [
      ...__EXTERNAL_PROVIDERS,
      JwtOptions,
      JwtAuthStrategy,
      JwtAuthService,
      AuthService,
      SignInInterceptor,
      SignOutInterceptor
  ],
  exports: [JwtAuthStrategy, JwtOptions],
  controllers: [AuthController]
})
export class AuthModule {}
