import { SearchAdjacentPostResult } from "../../dto";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";

@ApiExtraModels(SearchAdjacentPostResult)
export class SearchAdjacentPostsResponse {
    @ApiProperty({ type: [SearchAdjacentPostResult] })
    results: SearchAdjacentPostResult[];
}