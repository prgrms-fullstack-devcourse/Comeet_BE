import { CreateUserDTO } from "./index";
import { OmitType, PartialType } from "@nestjs/swagger";

export class UpdateUserDTO extends PartialType(
    OmitType(CreateUserDTO, ["githubId", "avatar", "birthyear"])
) {
    id: number;
}