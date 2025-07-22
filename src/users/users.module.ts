import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UserInterest, UserTech } from "./model";
import { SearchUsersService, UserInterestsService, UsersService, UserTechsService } from "./service";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserTech, UserInterest])],
    providers: [
        UsersService,
        UserTechsService,
        UserInterestsService,
        SearchUsersService,
    ],
    exports: [
        UsersService,
        UserTechsService,
        UserInterestsService,
        SearchUsersService,
    ]
})
export class UsersModule {}
