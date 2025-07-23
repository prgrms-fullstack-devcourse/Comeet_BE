import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LikeMark } from "./model";
import { LikesService } from "./likes.service";

@Module({
    imports: [TypeOrmModule.forFeature([LikeMark])],
    providers: [LikesService],
    exports: [LikesService]
})
export class LikesModule {}