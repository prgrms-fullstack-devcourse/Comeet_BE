import { TypeDTO } from "../../common/data";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class PositionDTO extends TypeDTO {
    @ApiProperty({ type: "string" })
    field: string;
}