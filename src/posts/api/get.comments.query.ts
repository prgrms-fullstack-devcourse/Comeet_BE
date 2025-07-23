import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetCommentsQuery {
    @IsNumber()
    @ApiProperty({ type: "integer", required: true })
    postId: number;
}