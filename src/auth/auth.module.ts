import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Subscription } from "../users/model";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { GithubModule } from "../github";
import { JwtAuthStrategy } from "./jwt.auth.strategy";
import { JwtOptions } from "./jwt.options";
import { AuthService, JwtAuthService } from "./service";
import { SignInInterceptor, SignOutInterceptor } from "./interceptor";
import { UsersModule, UsersService } from "../users";
import { SignUpGuard } from "./sign.up.guard";
import { SignUpSession } from "./sign.up.session";
import { Position, Tech } from "../tags/model";
import { Interest } from "../tags/model/interest.model";

const __EXTERNAL_PROVIDERS = [JwtService, UsersService];

@Module({
  imports: [
      TypeOrmModule.forFeature([User, Position, Tech, Interest, Subscription]),
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
      SignOutInterceptor,
      SignUpGuard,
      SignUpSession
  ],
  exports: [JwtAuthStrategy, JwtOptions],
  controllers: [AuthController]
})
export class AuthModule {}
