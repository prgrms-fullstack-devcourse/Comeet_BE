import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { TypeDTO } from "./type.dto";

@ApiExtraModels(TypeDTO)
export class GetTypesResponse {
    @ApiProperty({ type: [TypeDTO] })
    results: TypeDTO[];
}