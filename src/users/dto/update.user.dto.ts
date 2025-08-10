import { CreateUserDTO } from "./index";
import { OmitType, PartialType } from "@nestjs/swagger";

export class UpdateUserDTO extends PartialType(
    OmitType(CreateUserDTO, ["githubId", "birthyear"])
) {
    id: number;
}