import { UserIdentification } from "../../users/dto";
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class TokenPayload implements UserIdentification {
    @IsNumber()
    id: number;

    @IsNumberString()
    @IsNotEmpty()
    githubId: string;

    @IsString()
    salt: string;

    @IsNumber()
    iat: number;

    @IsNumber()
    exp: number;
}