import { PickType } from "@nestjs/swagger";
import { UserDTO } from "../../users/dto";

export class UserBadge extends PickType(
    UserDTO, ["nickname", "avatar"]
) {}