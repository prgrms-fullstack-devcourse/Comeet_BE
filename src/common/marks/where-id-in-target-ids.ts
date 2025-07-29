import { MarkBase } from "./mark.base";
import { SelectQueryBuilder } from "typeorm";

export function WhereIdInTargetIds<
    M extends MarkBase
>(
    cls: { new (...args: any[]): M },
    targetAlias: string
) {
    return (qb: SelectQueryBuilder<any>) => {

        const query = qb.subQuery()
            .select(`${cls.name}.targetId`)
            .from(cls, cls.name)
            .where(`${cls.name}.userId = :userId`)
            .getQuery();

        return`${targetAlias}.id IN ${query}`;
    };
}