import { MarkBase } from "./mark.base";
import { SelectQueryBuilder } from "typeorm";
import { Clazz } from "../../utils";

export function makeMarkExistsQuery<M extends MarkBase>(
    cls: Clazz<M>,
    qb: SelectQueryBuilder<any>,
): string {

  const sql = qb.subQuery()
      .select("1")
      .from(cls, "mark")
      .where(`mark.targetId = :id`)
      .andWhere(`mark.userId = :userId`)
      .getQuery();

  return `EXISTS(${sql})`;
}