import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserTech } from "../model";
import { In, Not, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class UserTechsService {

    constructor(
       @InjectRepository(UserTech)
       private readonly _userTechsRepo: Repository<UserTech>,
    ) {}

    @Transactional()
    async updateUserTechs(userId: number, techIds: number[]): Promise<void> {

        const olds = await this._userTechsRepo.find({
            where: {
                userId,
                techId: Not(In(techIds))
            },
            select: ["id"]
        });

        await this._userTechsRepo.delete(
            olds.map(({ id }) => id)
        );

        await this._userTechsRepo
            .createQueryBuilder("user_tech")
            .insert()
            .into(UserTech)
            .values(techIds.map(techId => ({ userId, techId })))
            .orIgnore()
            .updateEntity(false)
            .execute();
    }
}