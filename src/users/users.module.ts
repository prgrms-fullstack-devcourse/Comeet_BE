import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Subscription } from "./model";
import { GetUserInfoService, SearchUsersService, UsersService, SubscriptionsService } from "./service";
import { Position, Tech } from "../tags/model";
import { Interest } from "../tags/model/interest.model";
import { InterestsService, PositionsService, TechsService } from "../tags";
import { UsersController } from './users.controller';
import { GetUserInterceptor, SearchUsersInterceptor, UserLocationInterceptor } from "./interceptor";
import { UserValidationController } from "./user.validation.controller";

const __EXTERNAL_PROVIDERS = [
    PositionsService,
    TechsService,
    InterestsService
];

@Module({
    imports: [TypeOrmModule.forFeature([User, Subscription, Position, Tech, Interest])],
    providers: [
        ...__EXTERNAL_PROVIDERS,
        UsersService,
        SubscriptionsService,
        SearchUsersService,
        GetUserInfoService,
        GetUserInterceptor,
        SearchUsersInterceptor,
        UserLocationInterceptor,
    ],
    controllers: [UsersController, UserValidationController],
    exports: [
        ...__EXTERNAL_PROVIDERS,
        UsersService,
        SubscriptionsService,
        GetUserInfoService,
        UserLocationInterceptor,
    ],
})
export class UsersModule {}
