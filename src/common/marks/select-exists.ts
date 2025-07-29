import { MarkBase } from "./mark.base";
import { SelectQueryBuilder } from "typeorm";

export function SelectExists<
    M extends MarkBase
>(
    cls: { new (...args: any[]): M },
) {
  return (qb: SelectQueryBuilder<any>) => {

     const query = qb.subQuery()
         .select("1")
         .from(cls, cls.name)
         .where(`${cls.name}.targetId = :id`)
         .andWhere(`${cls.name}.userId = :userId`)
         .getQuery();

     return qb.addSelect(`EXISTS(${query})`);
  };
}