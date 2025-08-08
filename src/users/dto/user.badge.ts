import { PickType } from "@nestjs/swagger";
import { UserDTO } from "./index";

export class UserBadge extends PickType(
    UserDTO, ["nickname", "avatar"]
) {}