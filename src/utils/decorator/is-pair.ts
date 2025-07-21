import { applyDecorators } from "@nestjs/common";
import { ArrayMaxSize, ArrayMinSize, IsArray, ValidationOptions } from "class-validator";

export function IsPair(options?: ValidationOptions) {
    return applyDecorators(
        IsArray(options),
        ArrayMinSize(2),
        ArrayMaxSize(2)
    );
}