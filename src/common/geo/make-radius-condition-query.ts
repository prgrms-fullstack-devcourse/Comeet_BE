import { makeSelectDistanceQuery } from "./make-select-distance-query";

export function makeRadiusConditionQuery(
    tableAlias: string,
    prop: string,
): string {
    const distance = makeSelectDistanceQuery(tableAlias, prop);
    return `${distance} <= :radius`;
}