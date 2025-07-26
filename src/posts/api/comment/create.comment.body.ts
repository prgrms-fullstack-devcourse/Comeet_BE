import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateCommentBody {
    @IsInt()
    @ApiProperty({ type: "integer", required: true })
    postId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: "string", required: true })
    content: string;
}