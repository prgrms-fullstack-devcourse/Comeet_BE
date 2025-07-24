import { ApiProperty } from "@nestjs/swagger";

export class SignInFailResponse {
    @ApiProperty({ type: "string" })
    sessionId: string;
}