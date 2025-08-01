import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { FindOneOptions, QueryFailedError, Repository } from "typeorm";
import { CreateUserDTO, UserCert, UserDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import { InterestsService, PositionsService, TechsService } from "../../tags";
import { ModelBase } from "../../common/data";
import { UpdateUserDTO } from "../dto/update.user.dto";
import { SubscriptionsService } from "./subscriptions.service";

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
       @Inject(SubscriptionsService)
       private readonly _subsService: SubscriptionsService,
    ) {}

    @Transactional()
    async createUser(dto: CreateUserDTO): Promise<UserCert> {
        const values = await this.makeValues(dto);
        const { id, githubId } = await this._usersRepo.save(values);
        return { id, githubId };
    }

    async getUserCert(githubId: string): Promise<UserCert> {

        const { id } = await this.findUserOrReject({
            where: { githubId },
            select: ["id", "githubId"]
        });

        return { id, githubId };
    }

    async getMe(id: number): Promise<UserDTO> {
        const user = await this.findUserOrReject({
            where: { id },
            cache: true,
        });

        return Object.assign(
            ModelBase.excludeWithTimestamp(user, ["id", "githubId"]),
            { subscribing: null }
        );
    }

    async getOther(nickname: string, userId: number): Promise<UserDTO> {

        const user = await this._usersRepo.findOne({
            where: { nickname },
            cache: true,
        });

        if (!user) throw new NotFoundException();
        const subscribing = await this._subsService.isSubscribing(user.id, userId);

        return Object.assign(
            ModelBase.excludeWithTimestamp(user, ["id", "githubId"]),
            { subscribing }
        );
    }

    async existsByNickname(nickname: string): Promise<boolean> {
        return this._usersRepo.existsBy({ nickname });
    }

    @Transactional()
    async updateUser(dto: UpdateUserDTO): Promise<void> {
        const { id,  ...rest } = dto;
        const values = await this.makeValues(rest);

        await this._usersRepo.update(id, values)
            .catch(err => {
                throw err instanceof QueryFailedError
                    ? new ConflictException()
                    : err;
            });
    }

    @Transactional()
    async deleteUser(id: number): Promise<void> {
        await this._usersRepo.delete(id);
    }

    private async makeValues<
        T extends Partial<CreateUserDTO>
    >(dto: T): Promise<Partial<User>> {
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

