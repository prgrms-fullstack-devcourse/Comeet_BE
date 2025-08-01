import { UserCert } from "../../users/dto";
import { IsNumber, IsString } from "class-validator";

export class TokenPayload extends UserCert {
    @IsString()
    salt: string;

    @IsNumber()
    iat: number;

    @IsNumber()
    exp: number;
}