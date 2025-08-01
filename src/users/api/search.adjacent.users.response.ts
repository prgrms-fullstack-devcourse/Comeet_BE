import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { SearchAdjacentUserResult } from "../dto";

@ApiExtraModels(SearchAdjacentUserResult)
export class SearchAdjacentUsersResponse {
   @ApiProperty({ type: [SearchAdjacentUserResult] })
   results: SearchAdjacentUserResult[];
}