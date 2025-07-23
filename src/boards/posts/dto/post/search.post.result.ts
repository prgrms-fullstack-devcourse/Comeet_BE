import { ApiProperty } from "@nestjs/swagger";
import { SearchBoardResult } from "../../../common/dto";

export class SearchPostResult extends SearchBoardResult {
    @ApiProperty({ type: "integer" })
    nComments: number;
}
