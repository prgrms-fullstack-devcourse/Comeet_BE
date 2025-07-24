import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsPair } from "../../utils";

export class CreateRecruitBody {
    @IsNumber()
    @ApiProperty({ type: "integer", required: true })
    categoryId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: "string", required: true })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: "string", required: true })
    detail: string;

    @IsPair()
    @IsNumber({}, { each: true })
    @ApiProperty({
        type: "number",
        isArray: true,
        minLength: 2,
        maxLength: 2,
        required: true
    })
    location: [number, number];
}