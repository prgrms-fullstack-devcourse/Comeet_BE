import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class Coordinates {
    @IsNumber()
    @ApiProperty({ type: "number" })
    lng: number;

    @IsNumber()
    @ApiProperty({ type: "number" })
    lat: number;

    constructor(other?: Coordinates) {
        other && Object.assign(this, other);
    }
}