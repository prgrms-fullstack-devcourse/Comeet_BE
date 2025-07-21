import { SocialDTO, UserDTO } from "../../users/dto";
import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional,
    ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

export class SignUpBody extends PickType(
    UserDTO,
    ["nickname", "age", "experience", "bio", "location"]
) {
    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty({ type: "string", required: true })
    githubId: string;

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

    @Type(() => PartialType(SocialDTO))
    @ValidateNested()
    @IsOptional()
    @ApiProperty({ type: PartialType(SocialDTO), required: false })
    social?: Partial<SocialDTO>
}