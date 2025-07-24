import { ArrayMinSize, IsArray, IsEmail, IsInt, IsNumber, IsOptional, IsString, IsUrl, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsPair } from "../../utils";

export class UpdateUserBody {
    @IsString()
    @ApiProperty({ type: "string", required: false })
    nickname?: string;

    @IsInt()
    @Min(0)
    @ApiProperty({ type: "integer", required: false, description: "경력" })
    experience?: number;

    @IsString()
    @ApiProperty({ type: "string", required: false, description: "자기소개" })
    bio?: string;

    @IsPair()
    @IsNumber({}, { each: true })
    @ApiProperty({
        type: "array",
        items: { type: "integer" },
        minLength: 2,
        maxLength: 2,
        required: false,
        description: "위치 (경도, 위도) 순"
    })
    location?: [number, number];

    @IsInt()
    @ApiProperty({ type: "integer", required: false })
    positionId?: number;

    @ArrayMinSize(1)
    @IsInt({ each: true })
    @IsArray()
    @ApiProperty({
        type: "integer",
        isArray: true,
        required: false,
        minLength: 1
    })
    techIds?: number[];

    @ArrayMinSize(1)
    @IsInt({ each: true })
    @IsArray()
    @ApiProperty({
        type: "integer",
        isArray: true,
        required: false,
        minLength: 1
    })
    interestIds?: number[];

    @IsEmail()
    @IsOptional()
    @ApiProperty({ type: "string", required: false })
    email?: string

    @IsUrl()
    @IsOptional()
    @ApiProperty({ type: "string", required: false })
    instagram?: string;

    @IsUrl()
    @IsOptional()
    @ApiProperty({ type: "string", required: false })
    linkedIn?: string;

    @IsUrl()
    @IsOptional()
    @ApiProperty({ type: "string", required: false })
    blog?: string;
}