import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserTech } from "../model";
import { In, Not, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { TagDTO } from "../../tags/tag.dto";
import { ModelBase } from "../../common";

@Injectable()
export class UserTechsService {

    constructor(
        @InjectRepository(UserTech)
        private readonly _userTechsRepos: Repository<UserTech>,
    ) {}

    @Transactional()
    async addUserTech(userId: number, techIds: number[]): Promise<void> {
        await this._userTechsRepos
            .createQueryBuilder("user_tech")
            .insert()
            .into(UserTech)
            .values(techIds.map(techId => ({ userId, techId })))
            .orIgnore()
            .updateEntity(false)
            .execute();
    }

    @Transactional()
    async updateUserTechs(userId: number, techIds: number[]): Promise<void> {

        const olds = await this._userTechsRepos.find({
            where: { userId, techId: Not(In(techIds)) },
            select: ["id"]
        });

        olds.length && await this._userTechsRepos
            .delete(olds.map(({ id }) => id));

        await this.addUserTech(userId, techIds);
    }

    static toTagDTO(userTech: UserTech): TagDTO {
        return ModelBase.excludeTimestamp(userTech.tech);
    }
}