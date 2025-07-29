import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { Repository } from "typeorm";
import { Coordinates } from "../../common/geo";
import { GetUserDTO } from "../dto";

@Injectable()
export class GetUserLocationService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
    ) {}

    async getLocation(dto: GetUserDTO): Promise<Coordinates> {

        const user = await this._usersRepo.findOne({
            where: dto,
            select: ["location"]
        });

        if (!user) throw new ForbiddenException();
        return user.location;
    }
}