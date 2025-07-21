import { ApiProperty } from "@nestjs/swagger";

export class SignInResponse {
    @ApiProperty({ type: "string" })
    accessToken: string;
}