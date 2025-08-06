import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Subscription } from "../users/model";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { GithubModule } from "../github";
import { JwtAuthStrategy } from "./jwt.auth.strategy";
import { JwtOptions } from "./jwt.options";
import { AuthService, JwtAuthService, SignUpSessionService, BlacklistService } from "./service";
import { SignInInterceptor, SignOutInterceptor } from "./interceptor";
import { UsersModule, UsersService } from "../users";
import { SignUpGuard } from "./sign.up.guard";
import { Position, Tech } from "../tags/model";
import { Interest } from "../tags/model/interest.model";

const __EXTERNAL_PROVIDERS = [JwtService, UsersService];

@Module({
  imports: [
      TypeOrmModule.forFeature([User, Position, Tech, Interest, Subscription]),
      PassportModule.register({ session: false }),
      JwtModule.register({}),
      GithubModule,
      UsersModule
  ],
  providers: [
      ...__EXTERNAL_PROVIDERS,
      JwtOptions,
      JwtAuthService,
      AuthService,
      JwtAuthStrategy,
      SignUpSessionService,
      BlacklistService,
      SignInInterceptor,
      SignOutInterceptor,
      SignUpGuard,
  ],
  exports: [JwtAuthStrategy, JwtOptions, BlacklistService],
  controllers: [AuthController]
})
export class AuthModule {}
