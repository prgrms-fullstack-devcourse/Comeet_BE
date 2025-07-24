import { ConflictException, ForbiddenException, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { FindOneOptions, Repository } from "typeorm";
import { UserTechsService } from "./user.techs.service";
import { UserInterestsService } from "./user.interests.service";
import { CreateUserDTO, GetUserDTO, SearchUserResult, SearchUsersDTO, UpdateUserDTO, UserDTO, UserIdentification } from "../dto";
import { Transactional } from "typeorm-transactional";
import { ModelBase, TypeBase } from "../../common/data";
import { SearchUsersService } from "./search.users.service";
import { ageToBirthYear, birthYearToAge } from "./service.internal";
import { PositionsService } from "../../tags/service";
import { pick } from "../../utils/object";

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
        await this.checkConflict(dto);
        const { age, techIds, interestIds, ...rest } = dto;

        const { id, githubId } = await this._usersRepo.save({
           ...rest,
           birthYear: ageToBirthYear(age),
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
                position: true, social: true,
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

    private async checkConflict(dto: CreateUserDTO): Promise<void> {
        const { githubId } = dto;

        if (await this._usersRepo.existsBy({ githubId }))
            throw new ConflictException();
    }

    private async findUser(options: FindOneOptions<User>): Promise<User> {
        const user = await this._usersRepo.findOne(options);
        if (!user) throw new ForbiddenException();
        return user;
    }
}

function __toDTO(user: User): UserDTO {
    const { birthYear, social, position, userTechs, userInterests } = user;

    return {
        ...pick(user, ["id", "nickname", "experience", "location", "githubLink", "bio"]),
        age: birthYearToAge(birthYear),
        social: ModelBase.excludeWithTimestamp(social, ["id"]),
        position: PositionsService.toPositionDTO(position),
        techStack: userTechs.map(ut => TypeBase.toTypeDTO(ut.tech)),
        interests: userInterests.map(ui => TypeBase.toTypeDTO(ui.interest))
    }
}