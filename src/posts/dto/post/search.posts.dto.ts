import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SearchPostsDTO {
    userId?: number;

    @IsInt()
    @IsOptional()
    @ApiProperty({ type: "integer", required: false })
    boardId?: number;


    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({ type: "string", required: false })
    keyword?: string;
}