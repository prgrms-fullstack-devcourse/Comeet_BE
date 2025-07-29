import { MarkBase } from "./mark.base";
import { Repository, SelectQueryBuilder } from "typeorm";

export function createSelectTargetsQueryBuilder<
    M extends MarkBase
>(
    repo: Repository<M>,
    targetTable: string,
    targetAlias: string,
    userId: number,
): SelectQueryBuilder<M> {
    return repo.createQueryBuilder("mark")
        .where("mark.userId = :userId", { userId })
        .innerJoin(
            targetTable,
            targetAlias,
            `${targetAlias}.id = mark.targetId`,
        );
}