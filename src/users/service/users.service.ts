import { ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { Point, Repository } from "typeorm";
import { CreateUserDTO, GetUserDTO, SearchUsersDTO, UpdateUserDTO, UserDTO, UserIdentificationDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import { Location, locationToPoint, pointToLocation } from "../../utils";
import { ModelBase } from "../../common";
import { UserRolesService } from "./user.roles.service";
import { UserTechsService } from "./user.techs.service";
import { GithubService } from "../../github/service";

@Injectable()
export class UsersService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepos: Repository<User>,
       @Inject(UserRolesService)
       private readonly _userRolesService: UserRolesService,
       @Inject(UserTechsService)
       private readonly _userTechsService: UserTechsService
    ) {}

    @Transactional()
    async createUser(dto: CreateUserDTO): Promise<void> {
        const { githubId, roleIds, techIds,  ...rest } = dto;

        if (await this._usersRepos.existsBy({ githubId }))
            throw new ConflictException();

        const { id } = await this._usersRepos.save(
           __locationToPoint(rest)
        );

       roleIds.length && await this._userRolesService.addUserRoles(id, roleIds);
       techIds.length && await this._userTechsService.addUserTech(id, techIds);
    }

    async getUser(dto: GetUserDTO): Promise<UserDTO> {

       const user = await this._usersRepos.findOne({
           relations: { userRoles: true, userTechs: true, github: true },
           where: dto
       });

       if (!user) throw new ForbiddenException();
       return __toDTO(user);
    }

    async loadUserIdentification(dto: GetUserDTO): Promise<UserIdentificationDTO> {

        const user = await this._usersRepos.findOne({
            where: dto, select: ["id", "github"]
        });

        if (!user) throw new ForbiddenException();
        return { id: user.id, githubId: user.githubId };
    }

    @Transactional()
    async updateUser(dto: UpdateUserDTO): Promise<void> {
        const { id, roleIds, techIds, ...values } = dto;

        await this._usersRepos.update(
            id, __locationToPoint(values)
        );

        roleIds?.length && await this._userRolesService.updateUserRoles(id, roleIds);
        techIds?.length && await this._userTechsService.updateUserTechs(id, techIds);
    }

    async searchUsers(dto: SearchUsersDTO): Promise<UserDTO[]> {
        const { id, radius, experience, roleIds, techIds } = dto;
        const { lng, lat } = await this.getLocationOf(id);

        const qb =  this._usersRepos
            .createQueryBuilder("user")
            .select("user.*")
            .leftJoinAndSelect("user.user_roles", "user_role")
            .leftJoinAndSelect("user.user_techs", "user_tech")
            .leftJoinAndSelect("user.github", "github")
            .addSelect(
                "ST_Distance_Sphere(user.location, ST_Point(:lng, :lat))",
                "distance"
            )
            .orderBy("distance", "ASC")
            .where("distance <= :radius")
            .setParameters({ lng, lat, radius });

        if (experience) {
            qb.andWhere(
                "user.experience BETWEEN (:lower, :upper)",
                { lower: experience[0], upper: experience[1] }
            );
        }

        roleIds?.length &&
        qb.andWhere("user_role.role_id IN (...:roleIds)", { roleIds });


        techIds?.length &&
        qb.andWhere("user_tech.tech_id IN (...:techIds)", { techIds });

        const users = await qb.getMany();
        return users.map(__toDTO);
    }

    private async getLocationOf(id: number): Promise<Location> {

        const user = await this._usersRepos.findOne({
            where: { id },
            select: ["location"]
        });

        if (!user) throw new ForbiddenException();
        return pointToLocation(user.location);
    }
}

function __locationToPoint<
    T extends { location?: Location}
>(u: T): Omit<T, "location"> & { location?: Point; } {
    return Object.assign(
        u, { location: u.location && locationToPoint(u.location) }
    )
}

function __toDTO(user: User): UserDTO {

   const { location, userRoles, userTechs, github, ...rest }
       = ModelBase.excludeWithTimestamp(user, ["githubId"]);

   return {
       ...rest,
       location: pointToLocation(location),
       roles: userRoles.map(UserRolesService.toTagDTO),
       techs: userTechs.map(UserTechsService.toTagDTO),
       github: github && GithubService.toGithubAccountDTO(github)
   };
}

