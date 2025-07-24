import { SearchPostBaseResult } from "../search.post.base.result";
import { ApiProperty } from "@nestjs/swagger";

export class SearchPostResult extends SearchPostBaseResult{
    @ApiProperty({ type: "integer" })
    nComments: number;
}