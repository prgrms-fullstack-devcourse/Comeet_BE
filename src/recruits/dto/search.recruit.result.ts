import { RecruitDTO } from "./recruit.dto";
import { PickType } from "@nestjs/swagger";

export class SearchRecruitResult extends PickType(
    RecruitDTO,
    ["id", "category", "author", "title", "location", "createdAt", "nLikes"]
) {}
