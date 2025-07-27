import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./model";
import { UsersService } from "./service";
import { Position, Tech } from "../tags/model";
import { Interest } from "../tags/model/interest.model";
import { InterestsService, PositionsService, TechsService } from "../tags";

const __EXTERNAL_PROVIDERS = [
    PositionsService,
    TechsService,
    InterestsService
];

@Module({
    imports: [TypeOrmModule.forFeature([User, Position, Tech, Interest])],
    providers: [
        ...__EXTERNAL_PROVIDERS,
        UsersService,
    ],
    exports: [
        ...__EXTERNAL_PROVIDERS,
        UsersService
    ],
})
export class UsersModule {}
