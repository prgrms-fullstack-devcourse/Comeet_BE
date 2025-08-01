import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { TypeDTO } from "../../common/type";

@ApiExtraModels(TypeDTO)
export class SearchTechsResponse {
    @ApiProperty({ type: [TypeDTO] })
    results: TypeDTO[];
}