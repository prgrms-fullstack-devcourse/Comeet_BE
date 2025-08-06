export function makeSelectDistanceQuery(
    tableAlias: string,
    prop: string
): string {
    return `ST_DistanceSphere(${tableAlias}.${prop}, ST_Make_Point(:lng, :lat))`;
}