import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Coordinates } from "./coordinates";
import { Clazz } from "../../utils";

export class GeometricQueryResultBase {
    @ApiProperty({ type: Coordinates })
    location: Coordinates;


    @ApiProperty({ type: "number" })
    distance: number;
}

export function GeometricQueryResult<T extends object>(cls: Clazz<T>) {
    return IntersectionType(GeometricQueryResultBase, cls);
}
