import { ApiProperty } from "@nestjs/swagger";

export class UpdateRecruitLikeResponse {
    @ApiProperty({ type: "integer" })
    nLikes: number;
}