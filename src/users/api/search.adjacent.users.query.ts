import { SearchAdjacentUsersDTO } from "../dto";
import { OmitType } from "@nestjs/swagger";

export class SearchAdjacentUsersQuery extends OmitType(
    SearchAdjacentUsersDTO, ["origin"]
) {}