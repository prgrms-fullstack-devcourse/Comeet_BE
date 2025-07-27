import { SearchDeveloperResult } from "./search.developer.result";
import { ApiProperty } from "@nestjs/swagger";


export class SearchAdjacentDeveloperResult extends SearchDeveloperResult {
    @ApiProperty({ type: "number" })
    distance: number;
}