import { SelectQueryBuilder } from "typeorm";
import { Coordinates } from "./coordinates";

export function setGeometricQuery<M extends object>(
    qb: SelectQueryBuilder<M>,
    target: string,
    origin: Coordinates,
    radius: number,
    order?: "ASC" | "DESC"
): void {
    qb.addSelect(
        `ST_Distance_Sphere(${target}, ST_Point(:lng, :lat))`,
        "distance"
    )
        .andWhere(`ST_Distance_Sphere(${target}, ST_Point(:lng, :lat)) <= :radius`)
        .addOrderBy("distance", order ?? "ASC")
        .setParameters({ ...origin, radius });
}