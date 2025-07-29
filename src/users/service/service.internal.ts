import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { SearchUsersFilters } from "../dto";

export function setSelectClause<M extends object>(
    qb: SelectQueryBuilder<M>
): void {
    qb.select("user.id", "id")
        .addSelect("user.nickname", "nickname")
        .addSelect("user.birthyear", "birthyear")
        .addSelect("user.experience", "experience")
        .addSelect("user.position", "position")
        .addSelect("user.techStack", "techStack")
        .addSelect("user.interests", "interests")
        .addSelect("user.nSubscribers", "nSubscribers")
        .addSelect(
            "jsonb_build_object('lat', ST_Y(user.location), 'lng', ST_X(user.location))",
            "location"
        );
}

export function setWhereClause<M extends object>(
    qb: SelectQueryBuilder<M>,
    filters: SearchUsersFilters,
): void {
    const { birthyear, experience, positionIds, techIds, interestIds } = filters;

    birthyear && qb.andWhere(
        ...__makeRangeCondition("birthyear", birthyear)
    );

    experience && qb.andWhere(
        ...__makeRangeCondition("experience", experience)
    );

    if (positionIds?.length) {
        qb.andWhere(
            "position['id'] IN :...ids",
            { ids: positionIds.map(String) }
        );
    }

    techIds?.length && qb.andWhere(
        ...__makeHStoreCondition("techStack", techIds)
    );

    interestIds?.length && qb.andWhere(
        ...__makeHStoreCondition("interests", interestIds)
    );
}

function __makeRangeCondition(
    prop: string,
    range: [number, number],
): [string, ObjectLiteral] {
    const [lower, upper] = range;

    if (isNaN(lower)) {
        return [`${prop} <= :upper`, { upper }];
    }
    else if (isNaN(upper)) {
        return [`${prop} >= :lower`, { lower }];
    }
    else {
        return [
            `${prop} BETWEEN :lower AND :upper`,
            { lower, upper }
        ];
    }
}

function __makeHStoreCondition(
    prop: string,
    ids: number[],
): [string, ObjectLiteral] {
    return [
        `${prop} ?| ARRAY[:...ids]`,
        { ids: ids.map(String) }
    ];
}
