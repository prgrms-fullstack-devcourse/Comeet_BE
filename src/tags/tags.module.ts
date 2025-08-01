import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Position, Tech } from "./model";
import { Interest } from "./model/interest.model";
import { InterestsService, PositionsService, TechsService } from "./service";

@Module({
  imports: [TypeOrmModule.forFeature([Position, Tech, Interest])],
  providers: [
      PositionsService,
      TechsService,
      InterestsService
  ],
  controllers: [TagsController],
  exports: [
      PositionsService,
      TechsService,
      InterestsService
  ]
})
export class TagsModule {}
