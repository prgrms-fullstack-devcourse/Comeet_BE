import { ApiProperty } from "@nestjs/swagger";

export class SignInResponse {
    @ApiProperty({ type: "boolean" })
    success: boolean;

    @ApiProperty({ type: "string" })
    accessToken: string;
}