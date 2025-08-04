import { ApiProperty } from "@nestjs/swagger";

export class RenewResponse {
    @ApiProperty({ type: "string" })
    accessToken: string;
}