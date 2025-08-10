import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, Subscription } from "../model";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { SearchAdjacentUserResult, SearchAdjacentUsersDTO, SearchUserResult } from "../dto";
import { setSelectClause, WhereClause } from "./service.internal";
import { makeRadiusConditionQuery, makeSelectDistanceQuery } from "../../common/geo";
import { Clazz } from "../../utils";
import { WhereIdInTargetIds } from "../../common/marks";
import { plainToInstance } from "class-transformer";

@Injectable()
export class SearchUsersService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
    ) {}

    async searchAdjacentUsers(
       dto: SearchAdjacentUsersDTO
    ): Promise<SearchAdjacentUserResult[]> {
        const { id, origin, radius, ...filters } = dto;

        const raws = await this.createSelectQueryBuilder()
            .addSelect(
                makeSelectDistanceQuery("user", "location"),
                "distance"
            )
            .where(new Brackets(WhereClause(filters)))
            .andWhere(makeRadiusConditionQuery("user", "location"))
            .andWhere("user.id != :id", { id })
            .orderBy("distance", "ASC")
            .setParameters({ ...origin, radius })
            .getRawMany()

        return __toResults(SearchAdjacentUserResult, raws);
    }

    async searchSubscribingUsers(userId: number): Promise<SearchUserResult[]> {

        const raws = await this.createSelectQueryBuilder()
            .where(WhereIdInTargetIds(Subscription, "user"))
            .setParameters({ userId })
            .getRawMany();

        return __toResults(SearchUserResult, raws);
    }

    async searchHotUsers(): Promise<SearchUserResult[]> {

        const raws = await this.createSelectQueryBuilder()
            .orderBy('"nSubscribers"', "DESC")
            .take(50)
            .getRawMany();

        return __toResults(SearchUserResult, raws);
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
>(cls: Clazz<ResultT>, raws: any[]): ResultT[] {
    return raws.map(raw => plainToInstance(cls, raw));
}

