import { MarkBase } from "./mark.base";
import { SelectQueryBuilder } from "typeorm";

export function SelectExists<
    M extends MarkBase
>(
    cls: { new (...args: any[]): M },
) {
  return (qb: SelectQueryBuilder<any>) => qb.select(
      sqb => sqb.select('1')
          .from(cls, cls.name)
          .where(`${cls.name}.targetId = :id`)
          .andWhere(`${cls.name}.userId = :userId`)
  )
}