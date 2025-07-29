import { applyDecorators } from "@nestjs/common";
import { Matches } from "class-validator";
import { Transform } from "class-transformer";
import { Range } from "./range";

export function IsNumberRange() {
    return applyDecorators(
        Matches(/^(\d+)-(\d+)$/),
        Transform(({ value }) =>
            Range.from(value.split('-').map(Number) as [number, number])
        )
    )
}