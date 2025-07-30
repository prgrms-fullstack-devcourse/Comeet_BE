import { PickType } from "@nestjs/swagger";
import { UserDTO } from "../../users/dto";

export class ApplicantDTO extends PickType(
    UserDTO, ["nickname"]
) {}
