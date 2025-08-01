import { ApiProperty } from "@nestjs/swagger";

export class PositionDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    field: string;

    @ApiProperty({ type: "string" })
    role: string;
}