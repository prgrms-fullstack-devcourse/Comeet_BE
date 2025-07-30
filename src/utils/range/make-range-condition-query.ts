import { RangeObject } from "./range.object";

export function makeRangeConditionQuery(
    tableAlias: string,
    prop: string,
    range: RangeObject
): string{
    const tg = tableAlias + '.' + prop;

    if (range.lower === undefined)
        return `${tg} <= :upper`;
    else if (range.upper === undefined)
        return `${tg} >= :lower`;
    else
        return `${tg} BETWEEN :lower AND :upper`;

}