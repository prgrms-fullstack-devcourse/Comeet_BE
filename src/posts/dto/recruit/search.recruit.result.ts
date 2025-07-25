import { RecruitDTO } from "./recruit.dto";
import { PickType } from "@nestjs/swagger";

export class SearchRecruitResult extends PickType(
    RecruitDTO,
    ["id", "board", "author", "title", "location", "createdAt", "nLikes"]
) {}
