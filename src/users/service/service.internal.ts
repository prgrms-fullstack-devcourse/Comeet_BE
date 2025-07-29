import { SelectQueryBuilder } from "typeorm";
import { SearchUserResult, SearchUsersFilters } from "../dto";
import { User } from "../model";
import { pick } from "../../utils";
import { makeRangeCondition } from "../../utils/range";

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

export function WhereClause<M extends object>(
    filters: SearchUsersFilters,
) {
    return (qb: SelectQueryBuilder<User>) => {


        return sqb.getQuery();
    }
}

export function toSearchUserResult(user: User): SearchUserResult {
    return pick(
        user,
        [
            "id", "nickname", "birthyear", "location",
            "experience", "position", "techStack", "interests",
            "nSubscribers"
        ]
    );
}
