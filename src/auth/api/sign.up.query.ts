import { ApiProperty } from "@nestjs/swagger";

export class SignUpQuery {
    @ApiProperty({ type: "string", required: true })
    sessionId: string;
}