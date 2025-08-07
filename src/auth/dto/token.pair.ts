import { ApiProperty } from "@nestjs/swagger";

export class TokenPair {
    @ApiProperty({ type: "string", description: "액세스 토큰" })
    accessToken: string;
    refreshToken: string;
}