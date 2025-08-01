import { OmitType } from "@nestjs/swagger";
import { CreateUserDTO } from "../../users/dto";

export class SignUpBody extends OmitType(
    CreateUserDTO, ["githubId", "github"]
) {}