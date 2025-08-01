import { PickType } from "@nestjs/swagger";
import { CreateUserDTO } from "../dto";

export class AvailableNicknameQuery extends PickType(
    CreateUserDTO, ["nickname"]
) {}