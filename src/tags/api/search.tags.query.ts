import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SearchTagsQuery {
    @ApiProperty({ type: "string", required: true })
    @IsString()
    keyword: string;
}