import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Applicant, Recruit } from "./model";
import { LikesModule, LikesService } from "../likes";
import { ApplicantsService, RecruitsService, SearchRecruitsService } from "./service";
import { RecruitsController, UserActivitiesController, UserRecruitsController } from "./controller";
import { LikeMark } from "../likes/model";

const __EXTERNAL_PROVIDERS = [LikesService];

@Module({
    imports: [
        TypeOrmModule.forFeature([Recruit, Applicant, LikeMark]),
        LikesModule,
    ],
    providers: [
        ...__EXTERNAL_PROVIDERS,
        RecruitsService,
        SearchRecruitsService,
        ApplicantsService,
    ],
    controllers: [
        RecruitsController,
        UserRecruitsController,
        UserActivitiesController,
    ]
})
export class RecruitsModule {}
