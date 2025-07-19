import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { TypeDTO } from "./type.dto";

@ApiSchema()
export class TypeSchema implements TypeDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    value: string;
}