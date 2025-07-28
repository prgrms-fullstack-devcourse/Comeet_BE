import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";
import { SearchAdjacentUserResult, SearchUserResult, SearchUsersFilters } from "../dto";
import { Coordinates } from "../../utils";

@Injectable()
export class SearchUsersService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
    ) {}

    async searchAdjacentUsers(
        origin: Coordinates,
        radius: number,
        filters: SearchUsersFilters
    ): Promise<SearchAdjacentUserResult[]> {

        const qb = this.createSelectQueryBuilder()
            .addSelect(
            "ST_Distance_Sphere(user.location, ST_Point(:lng, :lat))",
            "distance"
            )
            .where("ST_Distance_Sphere(user.location, ST_Point(:lng, :lat)) <= :radius")
            .setParameters({ ...origin, radius });

        __setWhereClause(qb, filters);

        return qb.orderBy("distance", "ASC")
            .getRawMany<SearchAdjacentUserResult>();
    }

    async searchSubscribingUsers(ids: number[]): Promise<SearchUserResult[]> {
        return this.createSelectQueryBuilder()
            .whereInIds(ids)
            .getRawMany<SearchUserResult>()
    }

    async searchHotUsers(): Promise<SearchUserResult[]> {
        return this.createSelectQueryBuilder()
            .orderBy("nSubscribers", "DESC")
            .take(50)
            .getRawMany<SearchUserResult>();
    }

    private createSelectQueryBuilder(): SelectQueryBuilder<User> {
        return this._usersRepo
            .createQueryBuilder("user")
            .select("user.id", "id")
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
            )

    }
}

function __setWhereClause(
    qb: SelectQueryBuilder<User>,
    filters: SearchUsersFilters
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
