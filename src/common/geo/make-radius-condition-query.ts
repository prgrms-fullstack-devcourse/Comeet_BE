
export function makeRadiusConditionQuery(
    tableAlias: string,
    prop: string,
): string {
    return `ST_DWithin(
    ${tableAlias}.${prop},
    ST_SetSRID(ST_MakePoint(:lng, :lat), 4326),
    :radius * 1000
    )`;
}