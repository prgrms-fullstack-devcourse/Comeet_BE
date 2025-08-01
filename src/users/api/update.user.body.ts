import { OmitType, PartialType } from "@nestjs/swagger";
import { SignUpBody } from "../../auth/api";

export class UpdateUserBody extends PartialType(
    OmitType(SignUpBody, ["birthyear"])
){}