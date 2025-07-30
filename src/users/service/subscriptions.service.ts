import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "../model";
import { Repository } from "typeorm";
import { User } from "../model";
import { MarksServiceBase } from "../../common/marks";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class SubscriptionsService extends MarksServiceBase {

    constructor(
       @InjectRepository(Subscription)
       protected readonly _repo: Repository<Subscription>,
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
    ) { super(); }

    @Transactional()
    async updateSubscriptions(nickname: string, userId: number): Promise<[number, boolean]> {

        const target = await this._usersRepo.findOne({
            where: { nickname },
            select: ["id", "nSubscribers"],
        });

        if (!target) throw new NotFoundException();

        const delta = await this.updateMark(target.id, userId);
        const nSubscribers = Math.max(target.nSubscribers + delta, 0);
        await this._usersRepo.update(target.id, { nSubscribers });

        return [nSubscribers, delta === 1];
    }

    async isSubscribing(targetId: number, userId: number): Promise<boolean> {
        return this._repo.exists({
            where: { targetId, userId },
            cache: true,
        })
    }

}