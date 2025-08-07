import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CreateUserDTO } from "../../users/dto";
import { IsInt, IsPositive } from "class-validator";

export class SignUpBody extends OmitType(
    CreateUserDTO, ["githubId", "avatar", "birthyear", "github"]
) {
    @IsPositive()
    @IsInt()
    @ApiProperty({ type: "integer", minimum: 1 })
    age: number;
}