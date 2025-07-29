import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { FindOneOptions, Repository } from "typeorm";
import { CreateUserDTO, GetUserDTO, UserCert, UserDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import { InterestsService, PositionsService, TechsService } from "../../tags";
import { Coordinates, pick } from "../../utils";
import { ModelBase } from "../../common/data";
import { UpdateUserDTO } from "../dto/update.user.dto";
import { SearchUsersService } from "./search.users.service";
import { UserSubscriptionsService } from "./user.subscriptions.service";

@Injectable()
export class UsersService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
       @Inject(PositionsService)
       private readonly _positionsService: PositionsService,
       @Inject(TechsService)
       private readonly _techsService: TechsService,
       @Inject(InterestsService)
       private readonly _interestsService: InterestsService,
       @Inject(SearchUsersService)
       private readonly _searchUsersService: SearchUsersService,
       @Inject(UserSubscriptionsService)
       private readonly _subsService: UserSubscriptionsService,
    ) {}

    @Transactional()
    async createUser(dto: CreateUserDTO): Promise<UserCert> {
        const { githubId, birthyear, ...rest } = dto;

        if (await this._usersRepo.existsBy({ githubId }))
            throw new ConflictException();

       const values = await this.makeValues(rest);

        const { id } = await this._usersRepo.save({
            githubId, ...values
        });

        return { id, githubId };
    }

    async getUserCert(dto: GetUserDTO): Promise<UserCert> {

        const user = await this.findUserOrReject({
            where: dto,
            select: ["id", "githubId"]
        });

        return pick(user, ["id", "githubId"]);
    }

    async getUser(dto: GetUserDTO): Promise<UserDTO> {
        const user = await this._usersRepo.findOneBy(dto);
        if (!user) throw new NotFoundException();
        return ModelBase.excludeWithTimestamp(user, ["githubId"]);
    }

    async getUserLocation(dto: GetUserDTO): Promise<Coordinates> {

        const { location } = await this.findUserOrReject({
            select: { location: true },
            where: dto
        });

        return location;
    }

    @Transactional()
    async updateUser(dto: UpdateUserDTO): Promise<void> {
        const { id,  ...rest } = dto;
        const values = await this.makeValues(rest);
        await this._usersRepo.update(id, values);
    }

    private async makeValues(
        dto: Omit<UpdateUserDTO, "id">
    ): Promise<Partial<User>> {
        const { positionId, techIds, interestIds, ...rest } = dto;
        const values: Partial<User> = rest;

        if (positionId)
            values.position = await this._positionsService.getValue(positionId);

        if (techIds?.length)
            values.techStack = await this._techsService.getTechs(techIds);

        if (interestIds?.length)
            values.interests = await this._interestsService.getValues(interestIds);

        return values;
    }

    private async findUserOrReject(options: FindOneOptions<User>): Promise<User> {
        const user = await this._usersRepo.findOne(options);
        if (!user) throw new ForbiddenException();
        return user;
    }
}

