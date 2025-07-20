import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { TypeDTO } from "../../common";

@ApiExtraModels(TypeDTO)
export class SearchTagsResponse {
    @ApiProperty({ type: [TypeDTO] })
    results: TypeDTO[];
}