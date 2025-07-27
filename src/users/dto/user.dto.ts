import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";

export class UserDTO {
    @IsNumber()
    id: number;

    @IsNumberString()
    @IsNotEmpty()
    githubId: string;
}