import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { Repository } from "typeorm";
import { Coordinates } from "../../common/geo";

@Injectable()
export class GetUserLocationService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
    ) {}

    async getLocation(id: number): Promise<Coordinates> {

        const user = await this._usersRepo.findOne({
            where: { id },
            select: ["location"]
        });

        if (!user) throw new ForbiddenException();
        return user.location;
    }
}