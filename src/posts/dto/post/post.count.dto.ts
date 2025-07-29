import { ApiProperty } from "@nestjs/swagger";

export class PostCountDTO {
    @ApiProperty({ type: "integer" })
    nLikes: number;

    @ApiProperty({ type: "integer" })
    nComments: number;

    @ApiProperty({ type: "integer" })
    nApplicants: number;
}