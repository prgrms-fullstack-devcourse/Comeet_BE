import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { Repository } from "typeorm";
import { pick } from "../../utils";

@Injectable()
export class GetUserInfoService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
    ) {}

    async getUserInfo<
        K extends keyof User
    >(id: number, select: K[]): Promise<Pick<User, K>> {

        const user = await this._usersRepo.findOne({
            where: { id }, select
        });

        if (!user) throw new ForbiddenException();
        return pick(user, select);
    }
}