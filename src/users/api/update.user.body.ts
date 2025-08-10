import { OmitType } from "@nestjs/swagger";
import { UpdateUserDTO } from "../dto";

export class UpdateUserBody extends OmitType(
    UpdateUserDTO, ["id"]
) {}