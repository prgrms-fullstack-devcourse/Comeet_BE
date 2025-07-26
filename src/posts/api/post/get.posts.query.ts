import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class GetPostsQuery {
    @IsInt()
    @IsOptional()
    @ApiProperty({ type: "integer", required: false })
    categoryId?: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ type: "string", required: false })
    keyword?: string;
}