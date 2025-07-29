import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserSubscription } from "../model";
import { Repository, SelectQueryBuilder } from "typeorm";
import { SearchAdjacentUserResult, SearchAdjacentUsersDTO, SearchUserResult } from "../dto";
import { setSelectClause, setWhereClause } from "./service.internal";
import { setGeometricQuery } from "../../common/geo";
import { createSelectTargetsQueryBuilder } from "../../common/marks";
import { GetUserLocationService } from "./get.user.location.service";

@Injectable()
export class SearchUsersService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
       @InjectRepository(UserSubscription)
       private readonly _subsRepo: Repository<UserSubscription>,
       @Inject(GetUserLocationService)
       private readonly _getUserLocationService: GetUserLocationService
    ) {}

    async searchAdjacentUsers(
       dto: SearchAdjacentUsersDTO
    ): Promise<SearchAdjacentUserResult[]> {
        const { id, radius, ...filters } = dto;
        const origin = await this._getUserLocationService.getLocation(id);
        const qb = this.createSelectQueryBuilder();
        setWhereClause(qb, filters);
        setGeometricQuery(qb, "user.location", origin, radius);
        return qb.getRawMany<SearchAdjacentUserResult>();
    }

    async searchSubscribingUsers(userId: number): Promise<SearchUserResult[]> {

        const qb = createSelectTargetsQueryBuilder(
            this._subsRepo,
            "users", "user",
            userId
        );

        setSelectClause(qb);
        return qb.getRawMany<SearchUserResult>();
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

