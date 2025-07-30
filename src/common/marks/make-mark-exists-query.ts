import { MarkBase } from "./mark.base";
import { SelectQueryBuilder } from "typeorm";

export function makeMarkExistsQuery<M extends MarkBase>(
    cls: { new (...args: any[]): M },
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