export function makeSelectDistanceQuery(
    tableAlias: string,
    prop: string
): string {
    return `ST_DistanceSphere(${tableAlias}.${prop}, ST_MakePoint(:lng, :lat)) / 1000`;
}