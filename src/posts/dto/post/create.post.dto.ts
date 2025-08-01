import { Coordinates } from "../../../common/geo";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@ApiExtraModels(Coordinates)
export class CreatePostDTO {
    boardId: number;
    userId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: "string", required: true })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: "string", required: true })
    content: string;

    @Type(() => Coordinates)
    @ValidateNested()
    @IsOptional()
    @ApiProperty({ type: Coordinates, required: false })
    location?: Coordinates;
}