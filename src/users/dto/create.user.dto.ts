import { Coordinates } from "../../common/geo";
import {
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    IsUrl,
    Min,
    ValidateNested
} from "class-validator";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

@ApiExtraModels(Coordinates)
export class CreateUserDTO {
    githubId: string;
    avatar: string;
    github: string;

    @IsString()
    @ApiProperty({ type: "string", required: true })
    nickname: string;

    @IsPositive()
    @IsInt()
    @ApiProperty({ name: "age", type: "integer", required: true })
    birthyear: number;

    @IsInt()
    @Min(0)
    @ApiProperty({ type: "integer", required:true, description: "경력" })
    experience: number;

    @IsString()
    @ApiProperty({ type: "string", required: true, description: "자기소개" })
    bio: string;

    @Type(() => Coordinates)
    @ValidateNested()
    @ApiProperty({ type: Coordinates, required: true })
    location: Coordinates;

    @IsInt()
    @ApiProperty({ type: "integer", required: true })
    positionId: number;

    @ArrayMinSize(1)
    @IsInt({ each: true })
    @IsArray()
    @ApiProperty({
        type: "integer",
        isArray: true,
        required: true,
        minLength: 1
    })
    techIds: number[];

    @ArrayMinSize(1)
    @IsInt({ each: true })
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