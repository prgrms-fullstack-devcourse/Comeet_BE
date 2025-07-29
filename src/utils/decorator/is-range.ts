import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { applyDecorators } from "@nestjs/common";
import { IsPair } from "./is-pair";

function __IsRange(options?: ValidationOptions) {
    return function (object: any, propName: string) {
        registerDecorator({
            name: 'IsRange',
            target: object.constructor,
            propertyName: propName,
            options: options,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    return value[0] < value[1];
                }
            },
        });
    };
}

export function IsRange (options?: ValidationOptions) {
    return applyDecorators(
       IsPair(),
       __IsRange(options),
    );
}