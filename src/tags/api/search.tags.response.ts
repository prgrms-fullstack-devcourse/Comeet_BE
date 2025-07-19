import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { TypeSchema } from "../../common";

@ApiExtraModels(TypeSchema)
export class SearchTagsResponse {
    @ApiProperty({ type: [TypeSchema] })
    results: TypeSchema[];
}