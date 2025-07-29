import { SelectQueryBuilder } from "typeorm";

export function WhereIn<T>(
    alias: string,
    prop: string,
    arr: T[]
) {
    return (qb: SelectQueryBuilder<any>) => qb
        .subQuery()
        .where(`${alias}:${prop} IN :...arr`, { arr })
        .getQuery();
}