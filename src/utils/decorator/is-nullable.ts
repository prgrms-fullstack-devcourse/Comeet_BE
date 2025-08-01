import { ValidationOptions, ValidateIf } from 'class-validator';

export function IsNullable(options?: ValidationOptions) {
    return ValidateIf(
        (_, val) => val !== null,
        options
    );
}