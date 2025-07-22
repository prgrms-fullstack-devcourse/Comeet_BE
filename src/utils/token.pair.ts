import { IsNotEmpty, IsString } from "class-validator";

export class TokenPair {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}