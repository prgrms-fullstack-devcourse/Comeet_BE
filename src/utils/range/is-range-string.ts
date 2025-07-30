import { Matches, ValidatorOptions } from "class-validator";

export function IsNumberRangeString(options?: ValidatorOptions): PropertyDecorator {
    return Matches(/^(\d+)-(\d+)$/, options);
}

