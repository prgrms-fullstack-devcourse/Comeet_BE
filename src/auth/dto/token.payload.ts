import { IsInt, IsNumber, IsPositive, IsString } from "class-validator";

export class TokenPayload {
    @IsPositive()
    @IsInt()
    id: number;

    @IsString()
    salt: string;

    @IsNumber()
    iat: number;

    @IsNumber()
    exp: number;
}