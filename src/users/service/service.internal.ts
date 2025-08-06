import { SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
import { SearchUsersFilters } from "../dto";
import { addWhere } from "../../utils";
import { makeRangeConditionQuery } from "../../utils/range";
import { User } from "../model";
import { makeSelectCoordinatesQuery } from "../../common/geo";

export function setSelectClause(
    qb: SelectQueryBuilder<User>
): SelectQueryBuilder<User> {
    return qb.select([
        "user.nickname",
        "user.birthyear",
        "user.experience",
        "user.position",
        "user.techStack",
        "user.interests",
        "user.nSubscribers"
    ]).addSelect(
        makeSelectCoordinatesQuery("user", "location"),
        "location"
    );
}

export function WhereClause(filters: SearchUsersFilters) {
    return (qb: WhereExpressionBuilder) => {
        const { birthyear, experience, positionIds, techIds, interestIds } = filters;
        let nWhere = 0;

        if (birthyear) {
            nWhere = addWhere(
                nWhere, qb,
                makeRangeConditionQuery(
                    "user",
                    "birthyear",
                    birthyear
                ),
                birthyear
            );
        }

       if (experience) {
           nWhere = addWhere(
               nWhere, qb,
               makeRangeConditionQuery(
                   "user",
                   "experience",
                   experience
               ),
               experience
           );
       }

        if (positionIds?.length) {
            nWhere = addWhere(
                nWhere, qb,
                "user.position['id'] IN :...ids",
                { ids: positionIds.map(String) }
            );
        }

       if (techIds?.length) {
           nWhere = addWhere(
               nWhere, qb,
               __makeHStoreConditionQuery("techStack"),
               { ids: techIds.map(String) }
           )
       }

        if (interestIds?.length) {
            addWhere(
                nWhere, qb,
                __makeHStoreConditionQuery("interests"),
                { ids: interestIds.map(String) }
            )
        }

        return qb;
    };
}

function __makeHStoreConditionQuery(
    prop: string,
): string {
    return `user.${prop} ?| ARRAY[:...ids]`;
}
