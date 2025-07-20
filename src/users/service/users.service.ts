import { ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { FindOneOptions, ObjectLiteral, Repository } from "typeorm";
import { UserTechsService } from "./user.techs.service";
import { UserInterestsService } from "./user.interests.service";
import {
    CreateUserDTO,
    GetUserDTO,
    SearchUserResult,
    SearchUsersDTO,
    UpdateUserDTO,
    UserDTO,
    UserIdentification
} from "../dto";
import { Transactional } from "typeorm-transactional";
import { ModelBase, TypeDTO } from "../../common";
import { GitHubAccountsService } from "../../github/service";
import { pick } from "../../utils/object";

@Injectable()
export class UsersService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
       @Inject(UserTechsService)
       private readonly _userTechsService: UserTechsService,
       @Inject(UserInterestsService)
       private readonly _userInterestsService: UserInterestsService,
    ) {}

    @Transactional()
    async createUser(dto: CreateUserDTO): Promise<UserIdentification> {

        if (await this._usersRepo.existsBy({ githubId: dto.githubId }))
            throw new ConflictException();

        const { id, githubId } = await this._usersRepo.save({
           ...dto,
           userTechs: dto.techIds.map(techId => ({ techId })),
           userInterests: dto.interestIds.map(interestId => ({ interestId })),
        });

       return { id, githubId };
    }

    async getUserIdentification(dto: GetUserDTO): Promise<UserIdentification> {

        const { id, githubId } = await this.findUserBy({
            where: dto,
            select: ["id", "githubId"]
        });

        return { id, githubId };
    }

    async getUser(dto: GetUserDTO): Promise<UserDTO> {

        const user = await this.findUserBy({
            relations: {
                position: true, github: true, social: true,
                userTechs: { tech: true }, userInterests: { interest: true }
            },
            where: dto
        });

        return __toDTO(user);
    }

    @Transactional()
    async updateUser(dto: UpdateUserDTO): Promise<void> {
        const { id, ...values } = dto;
        await this._usersRepo.update(id, values);

        values.techIds?.length && await this._userTechsService
            .updateUserTechs(id, values.techIds);

        values.interestIds?.length && await this._userInterestsService
            .updateUserInterests(id, values.interestIds);
    }

    async searchUsers(dto: SearchUsersDTO): Promise<SearchUserResult[]> {
        const { id, radius, age, experience, positionIds, techIds, interestIds } = dto;

        const { location: origin } = await this.findUserBy({
            where: { id },
            select: ["id", "location"]
        });

        const qb = this._usersRepo
            .createQueryBuilder("user")
            .select("user.id")
            .addSelect("user.nickname")
            .addSelect("user.age")
            .addSelect("user.experience")
            .addSelect(
                "ST_Distance_Sphere(user.location, ST_POINT(:lng, :lat))",
                "distance"
            )
            .setParameters({ lng: origin[0], lat: origin[1] })
            .where("distance <= :radius", { radius });

        age && qb.andWhere(...__makeRangeQuery(age, "age"));
        experience && qb.andWhere(...__makeRangeQuery(experience, "experience"));

        positionIds?.length && qb.andWhere(
            ...__makeArrayQuery(positionIds, "user", "positionId")
        );

        if (techIds?.length) {
            qb.leftJoinAndSelect(
                "user.userTechs",
                "userTechs",
                ...__makeArrayQuery(
                    techIds,
                    "userTechs",
                    "techId"
                )
            )
        }
        else {
            qb.leftJoinAndSelect(
                "user.userTechs",
                "userTechs"
            );
        }

        qb.leftJoinAndSelect("userTechs.tech", "tech")

        if (interestIds?.length) {
            qb.leftJoinAndSelect(
                "user.userInterests",
                "userInterests",
                ...__makeArrayQuery(
                    interestIds,
                    "userInterests",
                    "interestId"
                )
            )
        }
        else {
            qb.leftJoinAndSelect(
                "user.userInterests",
                "userInterests"
            );
        }

        qb.leftJoinAndSelect("userInterests.interest", "interest");

        const results: Array<User & { distance: number; }>
            = await qb.orderBy("distance", "ASC").execute();

        return results
            .filter(({ userTechs, userInterests }) =>
                !!userTechs.length && (!!interestIds && !!userInterests.length)
            )
            .map(result => ({
            ...pick(result, ["id", "nickname", "age", "experience", "position", "distance"]),
            techStack: result.userTechs.map(({ tech }): TypeDTO =>
                pick(tech, ["id", "value"])
            ),
            interests: result.userInterests.map(({ interest }): TypeDTO =>
                pick(interest, ["id", "value"])
            )
        }));

    }

    private async findUserBy(options: FindOneOptions<User>): Promise<User> {
        const user = await this._usersRepo.findOne(options);
        if (!user) throw new ForbiddenException();
        return user;
    }
}

function __toDTO(user: User): UserDTO {

    const {
        github, social, userTechs, userInterests, ...rest
    } = ModelBase.excludeWithTimestamp(user, ["githubId", "positionId", "techIds", "interestIds"]);

    return {
        ...rest,
        github: GitHubAccountsService.toGithubAccountDTO(github),
        social: ModelBase.excludeWithTimestamp(social, ["id"]),
        techStack: userTechs.map(({ tech }): TypeDTO =>
            pick(tech, ["id", "value"])
        ),
        interests: userInterests.map(({ interest }): TypeDTO =>
            pick(interest, ["id", "value"])
        )
    }
}

function __makeRangeQuery(
    range: [number, number],
    propName: string
): [string, ObjectLiteral] {
    const [lower, upper] = range;

    if (lower === -Infinity) {
        return [`user.${propName} <= :upper`, { upper }];
    }
    else if (upper === Infinity) {
        return [`user.${propName} >= :lower`, { lower }];
    }
    else {
       return [`user.${propName} BETWEEN :lower AND :upper`, { lower, upper  }];
    }
}

function __makeArrayQuery(
    array: number[],
    targetName: string,
    propName: string
): [string, ObjectLiteral] {
    return [
        `${targetName}.${propName} IN (...array)`,
        { array }
    ];
}
