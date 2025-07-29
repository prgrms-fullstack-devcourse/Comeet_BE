import { IsInt, IsNotEmpty, IsNumberString } from "class-validator";

export class UserCert {
    @IsInt()
    id: number;

    @IsNumberString()
    @IsNotEmpty()
    githubId: string;
}