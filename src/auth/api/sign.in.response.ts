import { ApiExtraModels, ApiProperty, OmitType } from "@nestjs/swagger";
import { SignInResult } from "../dto";

@ApiExtraModels(SignInResult)
export class SignInResponse {

    @ApiProperty({
        type: OmitType(SignInResult, ["refreshToken"]),
        nullable: true,
        description: "로그인 실패시 null"
    })
    result: Omit<SignInResult, "refreshToken"> | null;

    @ApiProperty({ type: "string", nullable: true, description: "로그인 성공시 null" })
    sessionId: string | null;
}