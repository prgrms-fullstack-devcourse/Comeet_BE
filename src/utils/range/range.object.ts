import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class RangeObject {
    @IsNumber()
    @IsOptional()
    @ApiProperty({ type: "number", required: false })
    lower?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ type: "number", required: false })
    upper?: number;

    static fromRange(range: [number, number]): RangeObject {
        const obj = new RangeObject();
        isNaN(range[0]) || (obj.lower = range[0]);
        isNaN(range[1]) || (obj.upper = range[1]);
        return obj;
    }
}
