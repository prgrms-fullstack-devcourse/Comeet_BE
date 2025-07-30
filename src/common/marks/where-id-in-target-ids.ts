import { MarkBase } from "./mark.base";
import { SelectQueryBuilder } from "typeorm";

export function WhereIdInTargetIds<
    M extends MarkBase
>(
    cls: { new (...args: any[]): M },
    targetAlias: string,
    targetPK: string = "id"
) {
    return (qb: SelectQueryBuilder<any>) => {

        const query = qb.subQuery()
            .select("targetId")
            .from(cls, "mark")
            .where(`mark.userId = :userId`)
            .getQuery();

        return `${targetAlias}.${targetPK} IN ${query}`;
    }
}