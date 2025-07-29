import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class TypeDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    value: string;
}