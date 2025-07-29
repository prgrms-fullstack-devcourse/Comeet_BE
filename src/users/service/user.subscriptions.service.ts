import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSubscription } from "../model";
import { Repository } from "typeorm";
import { User } from "../model";
import { MarksServiceBase } from "../../common/marks";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class UserSubscriptionsService extends MarksServiceBase {

    constructor(
       @InjectRepository(UserSubscription)
       protected readonly _repo: Repository<UserSubscription>,
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
    ) { super(); }

    @Transactional()
    async updateSubscriptions(id: number, userId: number): Promise<number> {
        const delta = await this.updateMark(id, userId);

        await this._usersRepo
            .createQueryBuilder("user")
            .update()
            .set({
                nSubscribers: () =>
                    "CASE WHEN nSubscribers + :delta >= 0 THEN nSubscribers + :delta ELSE nSubscribers END",
            })
            .where("id = :id")
            .setParameters({ id, delta })
            .execute();

        const { nSubscribers } = await this._usersRepo.findOneOrFail({
            where: { id },
            select: ["nSubscribers"]
        });

        return nSubscribers;
    }
}