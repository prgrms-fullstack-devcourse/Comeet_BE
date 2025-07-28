import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SearchPostsDTO {
    boardId?: number;
    userId?: number;
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({ type: "string", required: false })
    keyword?: string;
}