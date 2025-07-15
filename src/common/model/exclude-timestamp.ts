import { ModelBase } from "./model.base";
import { omit } from "@fxts/core";

export function excludeTimestamp<
    M extends ModelBase,
    K extends keyof M
>(m: M, ...extras: K[]): Omit<M, "createdAt" | "updatedAt" | K> {
    return omit(["createdAt", "updatedAt", ...extras], m);
}

export function excludeTimestampOnly<
    M extends ModelBase
>(m: M): Omit<M, "createdAt" | "updatedAt"> {
    return excludeTimestamp(m);
}




