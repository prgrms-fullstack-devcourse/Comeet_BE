import { ApiProperty } from "@nestjs/swagger";
import {
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString, IsUrl,
    Min
} from "class-validator";
import { IsPair } from "../../utils";

export class SignUpBody {
    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty({ type: "string", required: true })
    githubId: string;

    @IsString()
    @ApiProperty({ type: "string", required: true })
    nickname: string;

    @IsNumber()
    @Min(0)
    @ApiProperty({ type: "integer", required: true })
    age: number;

    @IsNumber()
    @Min(0)
    @ApiProperty({ type: "integer", required:true, description: "경력" })
    experience: number;

    @IsString()
    @ApiProperty({ type: "string", required: true, description: "자기소개" })
    bio: string;

    @IsPair()
    @IsNumber({}, { each: true })
    @ApiProperty({
        type: "array",
        items: { type: "integer" },
        minLength: 2,
        maxLength: 2,
        required: true,
        description: "위치 (경도, 위도) 순"
    })
    location: [number, number];

    @IsNumber()
    @ApiProperty({ type: "integer", required: true })
    positionId: number;

    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    @IsArray()
    @ApiProperty({
        type: "integer",
        isArray: true,
        required: true,
        minLength: 1
    })
    techIds: number[];

    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
    @IsArray()
    @ApiProperty({
        type: "integer",
        isArray: true,
        required: true,
        minLength: 1
    })
    interestIds: number[];

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