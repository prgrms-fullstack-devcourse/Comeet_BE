import { ApiProperty } from "@nestjs/swagger";

export class UpdatePostLikeResponse {
    @ApiProperty({ type: "integer" })
    nLikes: number;
}