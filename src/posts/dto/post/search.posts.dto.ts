import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class SearchPostsDTO {
    userId?: number;

    @IsOptional()
    @IsInt()
    @Transform(({ value }) =>
        typeof value === 'undefined' ? value : parseInt(value, 10),
    )
    @ApiProperty({ type: "integer", required: false, description: "조회할 게시판 id" })
    boardId?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: "string", required: false })
    keyword?: string;
}