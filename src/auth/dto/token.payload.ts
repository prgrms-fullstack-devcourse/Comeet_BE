import { UserDTO } from "../../users/dto";
import { IsNumber, IsString } from "class-validator";

export class TokenPayload extends UserDTO {
    @IsString()
    salt: string;

    @IsNumber()
    iat: number;

    @IsNumber()
    exp: number;
}