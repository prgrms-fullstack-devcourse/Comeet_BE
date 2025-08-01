import { PickType } from "@nestjs/swagger";
import { UserDTO } from "./user.dto";

export class SearchUserResult extends PickType(
    UserDTO,
    ["nickname", "birthyear", "experience", "position", "techStack", "interests", "nSubscribers", "location"]
) {}