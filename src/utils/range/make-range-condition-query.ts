import { RangeObject } from "./range.object";

export function makeRangeConditionQuery<T>(
    tableAlias: string,
    prop: string,
    range: RangeObject<T>
): string{
    const tg = tableAlias + '.' + prop;

    if (range.lower === undefined)
        return `${tg} <= :upper`;
    else if (range.upper === undefined)
        return `${tg} >= :lower`;
    else
        return `${tg} BETWEEN :lower AND :upper`;

}