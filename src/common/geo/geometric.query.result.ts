import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Coordinates } from "./coordinates";

export class GeometricQueryResult {
    @ApiProperty({ type: Coordinates })
    location: Coordinates;

    @ApiProperty({ type: "number" })
    distance: number;
}

export function MakeGeometricQueryResult<T extends object>(
    cls: { new(...args: any[]): T },
) {
    return IntersectionType(
        cls, GeometricQueryResult
    );
}