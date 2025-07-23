import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { IsPair } from "../../utils";

export class GetRecruitsQuery {
    @IsNumber()
    @ApiProperty({ type: "integer", required: true })
    categoryId: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ type: "string", required: false })
    keyword?: string;

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