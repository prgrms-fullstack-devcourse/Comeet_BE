import { ApiProperty } from "@nestjs/swagger";


export class SignInQuery {
    @ApiProperty({ type: "string", required: true })
    code: string;
}