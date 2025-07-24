import { ApiProperty } from "@nestjs/swagger";

export class ApplicantDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    nickname: string;
}