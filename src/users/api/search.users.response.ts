import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { SearchUserResult } from "../dto";

@ApiExtraModels(SearchUserResult)
export class SearchUsersResponse {
    @ApiProperty({ type: [SearchUserResult] })
    results: SearchUserResult[];
}