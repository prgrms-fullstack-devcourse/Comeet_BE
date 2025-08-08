import { Transform, Type } from "class-transformer";
import { Coordinates } from "./coordinates";
import { IsNumber, IsPositive, ValidateNested } from "class-validator";
import { ApiExtraModels, ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Clazz } from "../../utils";

@ApiExtraModels(Coordinates)
export class GeometricQueryBase {
    @Type(() => Coordinates)
    @ValidateNested()
    @ApiProperty({ type: Coordinates })
    origin: Coordinates;

    @IsPositive()
    @IsNumber()
    @Transform(({ value }) => value && Number(value))
    @ApiProperty({ type: "number", required: true })
    radius: number;
}

export function GeometricQuery<T extends object>(cls: Clazz<T>) {
    return IntersectionType(GeometricQueryBase, cls);
}