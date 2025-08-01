import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpsertCommentBody {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: "string", required: true })
    content: string;
}