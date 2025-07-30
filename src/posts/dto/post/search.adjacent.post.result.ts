import { SearchPostResult } from "./search.post.result";
import { Coordinates } from "../../../common/geo";
import { ApiProperty } from "@nestjs/swagger";

export class SearchAdjacentPostResult extends SearchPostResult {
    @ApiProperty({ type: Coordinates })
    location: Coordinates;
}