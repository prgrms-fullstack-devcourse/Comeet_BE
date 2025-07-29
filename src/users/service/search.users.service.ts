import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserSubscription } from "../model";
import { Repository, SelectQueryBuilder } from "typeorm";
import { SearchAdjacentUserResult, SearchAdjacentUsersDTO, SearchUserResult } from "../dto";
import { setSelectClause, toSearchUserResult } from "./service.internal";
import { setGeometricQuery } from "../../common/geo";
import { WhereIdInTargetIds } from "../../common/marks";
import { pick } from "../../utils";

@Injectable()
export class SearchUsersService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
       @InjectRepository(UserSubscription)
       private readonly _subsRepo: Repository<UserSubscription>,
    ) {}

    async searchAdjacentUsers(
       dto: SearchAdjacentUsersDTO
    ): Promise<SearchAdjacentUserResult[]> {
        const { origin, radius, ...filters } = dto;

        const qb = this._usersRepo
            .createQueryBuilder("user")
            .select(setSelectClause)
            .


        const { entities: users, raw }
            = await qb.getRawAndEntities<{ distance: number; }>();

        return users.map((user, idx): SearchAdjacentUserResult =>
            Object.assign(
                toSearchUserResult(user),
                { distance: raw[idx].distance }
            )
        );
    }

    async searchSubscribingUsers(userId: number): Promise<SearchUserResult[]> {

        const { entities: users, raw: results } = await this.createSelectQueryBuilder()
            .where(
                WhereIdInTargetIds(UserSubscription, "user"),
                { userId }
            ).getRawAndEntities<SearchUserResult>();

        return results.map((result, idx) =>
            Object.assign(
                result,
                pick(users[idx], ["position", "techStack", "interests", "location"])
            )
        );
    }

    async searchHotUsers(): Promise<SearchUserResult[]> {
        return this.createSelectQueryBuilder()
            .orderBy("nSubscribers", "DESC")
            .take(50)
            .getRawMany<SearchUserResult>();
    }

    private createSelectQueryBuilder(): SelectQueryBuilder<User> {
        const qb = this._usersRepo.createQueryBuilder("user");
        setSelectClause(qb);
        return qb;
    }
}

