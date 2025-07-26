import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../../utils";
import { IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@ApiExtraModels(Coordinates)
export class CreatePostBody {
    @IsInt()
    @ApiProperty({ type: "integer", required: true })
    categoryId: number;

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
    @ApiProperty({ type: Coordinates, required: false })
    location?: Coordinates;
}