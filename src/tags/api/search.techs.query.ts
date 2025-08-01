import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SearchTechsQuery {
    @ApiProperty({ type: "string", required: true })
    @IsString()
    keyword: string;
}