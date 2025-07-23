import { ApiProperty } from "@nestjs/swagger";

export class UpdateBoardLikeResponse {
    @ApiProperty({ type: "integer" })
    nLikes: number;
}