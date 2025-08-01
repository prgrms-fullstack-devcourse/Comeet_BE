import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, Subscription } from "../model";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { SearchAdjacentUserResult, SearchAdjacentUsersDTO, SearchUserResult } from "../dto";
import { setSelectClause, WhereClause } from "./service.internal";
import { makeSelectCoordinatesQuery, makeSelectDistanceQuery } from "../../common/geo";
import { pick } from "../../utils";
import { WhereIdInTargetIds } from "../../common/marks";

@Injectable()
export class SearchUsersService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
    ) {}

    async searchAdjacentUsers(
       dto: SearchAdjacentUsersDTO
    ): Promise<SearchAdjacentUserResult[]> {
        const { origin, radius, ...filters } = dto;

        const { entities, raw } = await this.createSelectQueryBuilder()
            .addSelect(
                makeSelectCoordinatesQuery("user", "location"),
                "location"
            )
            .addSelect(
                makeSelectDistanceQuery("user", "location"),
                "distance"
            )
            .where(new Brackets(WhereClause(filters)))
            .orderBy("distance", "ASC")
            .setParameters({ ...origin, radius })
            .getRawAndEntities<SearchAdjacentUserResult>();

        return __toResults(entities, raw);
    }

    async searchSubscribingUsers(userId: number): Promise<SearchUserResult[]> {

        const { entities, raw } = await this.createSelectQueryBuilder()
            .where(WhereIdInTargetIds(Subscription, "user"))
            .setParameters({ userId })
            .getRawAndEntities<SearchUserResult>()

        return __toResults(entities, raw);
    }

    async searchHotUsers(): Promise<SearchUserResult[]> {

        const { entities, raw } = await this.createSelectQueryBuilder()
            .orderBy("nSubscribers", "DESC")
            .take(50)
            .getRawAndEntities<SearchUserResult>();

        return __toResults(entities, raw);
    }

    private createSelectQueryBuilder(): SelectQueryBuilder<User> {
       return setSelectClause(
           this._usersRepo
               .createQueryBuilder("user")
       );
    }
}

function __toResults<
    ResultT extends SearchUserResult
>(users: User[], results: ResultT[]): ResultT[] {
    return results.map((result, idx): ResultT =>
        Object.assign(
            result,
            pick(users[idx], ["position", "techStack", "interests"])
        )
    );
}

