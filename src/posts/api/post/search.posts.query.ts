import { OmitType } from "@nestjs/swagger";
import { SearchPostsDTO } from "../../dto";

export class SearchPostsQuery extends OmitType(
    SearchPostsDTO, ["userId"]
) {}