import { SelectQueryBuilder } from "typeorm";

export function WhereWithinRadius(
    pointAlias: string,
) {
    return (qb: SelectQueryBuilder<any>) => qb
        .subQuery()
        .where(`ST_Distance_Sphere(${pointAlias}, ST_Point(:lng, :lat)) <= :radius`)
        .getQuery();
}