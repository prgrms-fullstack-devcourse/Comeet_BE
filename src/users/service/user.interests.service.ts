import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserInterest } from "../model";
import { In, Not, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class UserInterestsService {

    constructor(
       @InjectRepository(UserInterest)
       private readonly _userInterestsRepo: Repository<UserInterest>,
    ) {}

    @Transactional()
    async updateUserInterests(userId: number, interestIds: number[]): Promise<void> {

        const olds = await this._userInterestsRepo.find({
            where: {
                userId,
                interestId: Not(In(interestIds))
            },
            select: ["id"]
        });

        await this._userInterestsRepo.delete(
            olds.map(({ id }) => id)
        );

        await this._userInterestsRepo
            .createQueryBuilder("user_interest")
            .insert()
            .into(UserInterest)
            .values(
                interestIds.map(interestId => ({ userId, interestId }))
            )
            .orIgnore()
            .updateEntity(false)
            .execute();
    }
}