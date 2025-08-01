import { SearchPostsDTO } from "./search.posts.dto";
import { ApiExtraModels, ApiProperty, OmitType } from "@nestjs/swagger";
import { Coordinates } from "../../../common/geo";
import { IsNumber, IsPositive, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@ApiExtraModels(Coordinates)
export class SearchAdjacentPostsDTO extends OmitType(SearchPostsDTO, ["userId"]) {
    @Type(() => Coordinates)
    @ValidateNested()
    @ApiProperty({ type: Coordinates })
    origin: Coordinates;

    @IsPositive()
    @IsNumber()
    @ApiProperty({ type: "number", required: true })
    radius: number;
}