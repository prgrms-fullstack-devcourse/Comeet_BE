import { applyDecorators } from "@nestjs/common";
import { IsArray, Max, Min, ValidationOptions } from "class-validator";

export function IsPair(options?: ValidationOptions) {
    return applyDecorators(
        IsArray(options),
        Min(2),
        Max(2)
    );
}