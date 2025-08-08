import { Matches, registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { Transform } from "class-transformer";

function __IsRange(validationOptions?: ValidationOptions) {
    return function (object: any, propName: string) {
        registerDecorator({
            name: 'IsRange',
            target: object.constructor,
            propertyName: propName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    return value[0] < value[1] || value.some(isNaN);
                }
            },
        });
    };
}

export function IsRange (options?: ValidationOptions) {
    return applyDecorators(
        Matches(/^(\d)-(\d)$/),
        Transform(({ value }) =>
            value && value.split('-')
                .map(s => Number(s.trim()))
        ),
        __IsRange(options),
    );
}