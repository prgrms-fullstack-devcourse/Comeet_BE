import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "../model";
import { In, Not, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { TagDTO } from "../../tags/tag.dto";
import { ModelBase } from "../../common";


@Injectable()
export class UserRolesService {

    constructor(
       @InjectRepository(UserRole)
       private readonly _userRolesRepos: Repository<UserRole>,
    ) {}

    @Transactional()
    async addUserRoles(userId: number, roleIds: number[]): Promise<void> {
        await this._userRolesRepos
            .createQueryBuilder("user_role")
            .insert()
            .into(UserRole)
            .values(roleIds.map(roleId => ({ userId, roleId })))
            .orIgnore()
            .updateEntity(false)
            .execute();
    }

    @Transactional()
    async updateUserRoles(userId: number, roleIds: number[]): Promise<void> {

        const olds = await this._userRolesRepos.find({
           where: { userId, roleId: Not(In(roleIds)) },
           select: ["id"]
        });

        olds.length && await this._userRolesRepos
            .delete(olds.map(({ id }) => id));

        await this.addUserRoles(userId, roleIds);
    }

    static toTagDTO(userRole: UserRole): TagDTO {
        return ModelBase.excludeTimestamp(userRole.role);
    }
}