import { SelectQueryBuilder } from "typeorm";

export function SelectDistance(pointAlias: string) {
    return (qb: SelectQueryBuilder<any>) => qb
        .addSelect(
            `ST_Distance_Sphere(${pointAlias}, ST_Point(:lng, :lat))`,
            "distance"
        );
}