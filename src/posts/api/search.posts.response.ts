import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { SearchPostResult } from "../dto";

@ApiExtraModels(SearchPostResult)
export class SearchPostsResponse {
    @ApiProperty({ type: [SearchPostResult] })
    results: SearchPostResult[];
}