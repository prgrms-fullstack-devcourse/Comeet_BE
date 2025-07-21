import { ConflictException, ForbiddenException, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { FindOneOptions, Repository } from "typeorm";
import { UserTechsService } from "./user.techs.service";
import { UserInterestsService } from "./user.interests.service";
import { CreateUserDTO, GetUserDTO, SearchUserResult, SearchUsersDTO, UpdateUserDTO, UserDTO, UserIdentification } from "../dto";
import { Transactional } from "typeorm-transactional";
import { ModelBase, TypeBase } from "../../common";
import { GitHubAccountsService } from "../../github/service";
import { SearchUsersService } from "./search.users.service";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class UsersService {
    private readonly _logger: Logger = new Logger(UsersService.name);

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
       @Inject(UserTechsService)
       private readonly _userTechsService: UserTechsService,
       @Inject(UserInterestsService)
       private readonly _userInterestsService: UserInterestsService,
       @Inject(SearchUsersService)
       private readonly _searchUsersService: SearchUsersService,
    ) {}

    @Transactional()
    async createUser(dto: CreateUserDTO): Promise<UserIdentification> {
        const { techIds, interestIds, ...rest } = dto;

        if (await this._usersRepo.existsBy({ githubId: dto.githubId }))
            throw new ConflictException();

        const { id, githubId } = await this._usersRepo.save({
           ...rest,
           userTechs: techIds.map(techId => ({ techId })),
           userInterests: interestIds.map(interestId => ({ interestId })),
        });

       return { id, githubId };
    }

    async getUserIdentification(dto: GetUserDTO): Promise<UserIdentification> {
        const { id, githubId } = await this.findUser({where: dto});
        return { id, githubId };
    }

    async getUser(dto: GetUserDTO): Promise<UserDTO> {

        const user = await this.findUser({
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
        const { id, ...filters } = dto;

        const { location: origin } = await this.findUser({
            where: { id },
            select: ["location"]
        });

        return await this._searchUsersService.searchUsers(origin, filters);
    }

    @Cron(CronExpression.EVERY_YEAR)
    async updateAge() {

        try {
            const users = await this._usersRepo.find();

            await this._usersRepo.update(
                users.map(u => u.id),
                { age: () => "age + 1" }
            );
        }
        catch (err) {
            this._logger.error(err); // Strategy for failure should added
        }
    }

    private async findUser(options: FindOneOptions<User>): Promise<User> {
        const user = await this._usersRepo.findOne(options);
        if (!user) throw new ForbiddenException();
        return user;
    }
}

function __toDTO(user: User): UserDTO {

    const {
        github, social, userTechs, userInterests, ...rest
    } = ModelBase.excludeWithTimestamp(user, ["githubId", "positionId"]);

    return {
        ...rest,
        github: GitHubAccountsService.toGithubAccountDTO(github),
        social: ModelBase.excludeWithTimestamp(social, ["id"]),
        techStack: userTechs.map(ut => TypeBase.toTypeDTO(ut.tech)),
        interests: userInterests.map(ui => TypeBase.toTypeDTO(ui.interest))
    }
}