import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePostBody {
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
    content: string;
}