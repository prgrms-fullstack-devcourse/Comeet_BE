import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class GenerateTokenResult {
    @IsString()
    @IsNotEmpty()
    @Expose({ name: "access_token" })
    accessToken: string;
}