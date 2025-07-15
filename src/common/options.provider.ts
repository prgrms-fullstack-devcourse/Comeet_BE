import { FactoryProvider, InjectionToken } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export type OptionsFactory<T = any> = (config: ConfigService) => T;

export function OptionsProvider<T>(
    token: string | Symbol,
    factory?: OptionsFactory<T>,
): FactoryProvider<T> {
    return {
        provide: token as InjectionToken,
        useFactory: factory || __DefaultFactory<T>(token),
        inject: [ConfigService]
    };
}

function __DefaultFactory<T>(token: string | Symbol): OptionsFactory<T> {
    const key = typeof token === 'string' ? token : token.description!;
    return (config: ConfigService) => config.get<T>(key)!
}