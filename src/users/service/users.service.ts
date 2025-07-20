import { ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { FindOneOptions, Repository } from "typeorm";
import { UserTechsService } from "./user.techs.service";
import { UserInterestsService } from "./user.interests.service";
import { CreateUserDTO, GetUserDTO, UpdateUserDTO, UserDTO, UserIdentification } from "../dto";
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
        const { id, githubId } = await this.findUserBy({where: dto});
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