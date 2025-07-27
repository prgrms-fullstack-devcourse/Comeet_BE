import { ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { Repository } from "typeorm";
import { CreateUserDTO, GetUserDTO, UserDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import { InterestsService, PositionsService, TechsService } from "../../tags";
import { pick } from "../../utils";

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
    ) {}

    @Transactional()
    async createUser(dto: CreateUserDTO): Promise<UserDTO> {
        const { githubId, positionId, techIds, interestIds, ...rest } = dto;

        if (await this._usersRepo.existsBy({ githubId }))
            throw new ConflictException();

        const position = await this._positionsService.getValue(positionId);
        const techStack = await this._techsService.getTechs(techIds);
        const interests = await this._interestsService.getValues(interestIds);

        const { id } = await this._usersRepo.save({
            githubId,
            developer: {
                ...rest,
                position, techStack, interests
            }
        });

        return { id, githubId };
    }

    async getUser(dto: GetUserDTO): Promise<UserDTO> {
        const user = await this._usersRepo.findOneBy(dto);
        if (!user) throw new ForbiddenException();
        return pick(user, ["id", "githubId"]);
    }
}

