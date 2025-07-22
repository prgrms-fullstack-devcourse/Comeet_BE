import { ApiProperty } from "@nestjs/swagger";

export class SignInFailResponse {
    @ApiProperty({ type: "string" })
    githubId: string;
}