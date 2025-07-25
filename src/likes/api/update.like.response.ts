import { ApiProperty } from "@nestjs/swagger";

export class UpdateLikeResponse {
    @ApiProperty({ type: "integer", description: "현재 좋이요 수" })
    nLikes: number;
}