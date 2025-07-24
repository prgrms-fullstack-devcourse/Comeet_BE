import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { TypeDTO } from "../../common/data";

@ApiExtraModels(TypeDTO)
export class SearchTechsResponse {
    @ApiProperty({ type: [TypeDTO] })
    results: TypeDTO[];
}