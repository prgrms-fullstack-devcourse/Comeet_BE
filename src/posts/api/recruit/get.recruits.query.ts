import { GetPostsQuery } from "../post";
import { IsPair } from "../../../utils";
import { IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetRecruitsQuery extends GetPostsQuery {
    @IsPair()
    @IsNumber({}, { each: true })
    @IsOptional()
    @ApiProperty({
        type: "number",
        isArray: true,
        minLength: 2,
        maxLength: 2,
        required: false
    })
    location?: [number, number];
}