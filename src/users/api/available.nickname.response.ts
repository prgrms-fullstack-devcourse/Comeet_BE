import { ApiProperty } from "@nestjs/swagger";

export class AvailableNicknameResponse {
    @ApiProperty({ type: "boolean" })
    available: boolean;
}