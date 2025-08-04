import { ApiProperty } from "@nestjs/swagger";

export class SignInResponse {
    @ApiProperty({ type: "string", nullable: true, description: "로그인 실패시 null" })
    accessToken: string | null;

    @ApiProperty({ type: "string", nullable: true, description: "로그인 성공시 null" })
    sessionId: string | null;
}