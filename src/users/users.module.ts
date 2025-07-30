import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UserSubscription } from "./model";
import { GetUserLocationService, SearchUsersService, UsersService, UserSubscriptionsService } from "./service";
import { Position, Tech } from "../tags/model";
import { Interest } from "../tags/model/interest.model";
import { InterestsService, PositionsService, TechsService } from "../tags";
import { UsersController } from './users.controller';
import { GetUserInterceptor, SearchUsersInterceptor, UserLocationInterceptor } from "./interceptor";

const __EXTERNAL_PROVIDERS = [
    PositionsService,
    TechsService,
    InterestsService
];

@Module({
    imports: [TypeOrmModule.forFeature([User, UserSubscription, Position, Tech, Interest])],
    providers: [
        ...__EXTERNAL_PROVIDERS,
        UsersService,
        UserSubscriptionsService,
        SearchUsersService,
        GetUserLocationService,
        GetUserInterceptor,
        SearchUsersInterceptor,
        UserLocationInterceptor,
    ],
    controllers: [UsersController],
    exports: [
        ...__EXTERNAL_PROVIDERS,
        UsersService,
        UserSubscriptionsService,
        GetUserLocationService,
        UserLocationInterceptor,
    ],
})
export class UsersModule {}
