import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { SearchRecruitResult } from "../dto";

@ApiExtraModels(SearchRecruitResult)
export class GetRecruitsResponse {
    @ApiProperty({ type: [SearchRecruitResult] })
    results: SearchRecruitResult[];
}