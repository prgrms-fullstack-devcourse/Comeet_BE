import { SearchUserResult } from "./search.user.result";
import { ApiProperty } from "@nestjs/swagger";

export class SearchAdjacentUserResult extends SearchUserResult {
    @ApiProperty({ type: "number" })
    distance: number;
}