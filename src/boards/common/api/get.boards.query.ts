import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { IsRange } from "../../../utils";

export class GetBoardsQuery {
    @IsNumber()
    @ApiProperty({ type: "integer", required: true })
    categoryId: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ type: "string", required: false })
    keyword?: string;

    @IsRange()
    @IsDate({ each: true })
    @IsOptional()
    @ApiProperty({ type: [Date], minLength: 2, maxLength: 2, required: false })
    createdAt?: [Date, Date];
}