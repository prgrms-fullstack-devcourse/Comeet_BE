import { IsInt, Min, ValidationOptions } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { Expose, Transform } from "class-transformer";

const __transform
    = (x: number) => new Date().getFullYear() - x + 1;

export function IsBirthYear(options?: ValidationOptions) {
    return applyDecorators(
        Expose({ name: "age" }),
        IsInt(options),
        Min(0),
        Transform(({ value }) =>
            value instanceof Array
                ? value.map(__transform).reverse()
                : __transform(value)
        )
    )
}

