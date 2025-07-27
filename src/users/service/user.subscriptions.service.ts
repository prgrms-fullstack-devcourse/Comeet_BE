import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSubscription } from "../model";
import { Repository } from "typeorm";
import { User } from "../model";
import { MarksServiceBase } from "../../common/marks";
import { Transactional } from "typeorm-transactional";
import { SearchUserResult } from "../dto";
import { SearchUsersService } from "./search.users.service";

@Injectable()
export class UserSubscriptionsService extends MarksServiceBase{

    constructor(
       @InjectRepository(UserSubscription)
       protected readonly _repo: Repository<UserSubscription>,
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
       @Inject(SearchUsersService)
       protected readonly _searchUsersService: SearchUsersService
    ) { super(); }

    @Transactional()
    async updateSubscriptions(userId: number, targetId: number): Promise<void> {
        const delta = await this.updateMark(userId, targetId);

        await this._usersRepo
            .createQueryBuilder("user")
            .update()
            .set({
                nSubscribers: () =>
                    "CASE WHEN nSubscribers + :delta >= 0 THEN nSubscribers + :delta ELSE nSubscribers END",
            })
            .where("id = :targetId")
            .setParameters({ delta, targetId })
            .execute();
    }

    async searchSubscribingUsers(userId: number): Promise<SearchUserResult[]> {
        const targetIds = await this.getTargetIds(userId);
        return this._searchUsersService.searchSubscribingUsers(targetIds);
    }
}