import { OmitType } from "@nestjs/swagger";
import { SearchAdjacentPostsDTO } from "../../dto";

export class SearchAdjacentPostsQuery extends OmitType(
    SearchAdjacentPostsDTO, ["origin"]
) {}