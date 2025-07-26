import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetPostsQuery {
    @IsString()
    @IsOptional()
    @ApiProperty({ type: "string", required: false })
    keyword?: string;
}