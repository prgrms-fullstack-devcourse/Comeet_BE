import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateRecruitBody } from "./create.recruit.body";

export class UpdateRecruitBody extends PartialType(
    OmitType(CreateRecruitBody, ["categoryId"])
) {}