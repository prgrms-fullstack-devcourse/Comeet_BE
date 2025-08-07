import { MarkBase } from "./mark.base";
import { SelectQueryBuilder } from "typeorm";
import { Clazz } from "../../utils";

export function WhereIdInTargetIds<
    M extends MarkBase
>(
    cls: Clazz<M>,
    targetAlias: string,
    targetPK: string = "id"
) {
    return (qb: SelectQueryBuilder<any>) => {

        const query = qb.subQuery()
            .select("mark.targetId")
            .from(cls, "mark")
            .where(`mark.userId = :userId`)
            .getQuery();

        return `${targetAlias}.${targetPK} IN ${query}`;
    }
}