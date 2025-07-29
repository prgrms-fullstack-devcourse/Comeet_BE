import { ApiProperty } from "@nestjs/swagger";

export class UpdateApplyResponse {
    @ApiProperty({ type: "boolean" })
    applied: boolean;
}