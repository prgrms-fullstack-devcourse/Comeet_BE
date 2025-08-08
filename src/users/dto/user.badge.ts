import { PickType } from "@nestjs/swagger";
import { UserDTO } from "./user.dto";

export class UserBadge extends PickType(
    UserDTO, ["nickname", "avatar"]
) {}