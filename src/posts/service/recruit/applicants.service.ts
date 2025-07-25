import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Applicant, Recruit } from "../../model";
import { QueryFailedError, Repository } from "typeorm";

@Injectable()
export class ApplicantsService {
    constructor(
       @InjectRepository(Applicant)
       private readonly _applicantsRepo: Repository<Applicant>,
    ) {}

    async applyOrQuit(recruitId: number, userId: number): Promise<void> {
        const applicant = await this._applicantsRepo.findOneBy({ recruitId, userId });

        try {
            applicant
                ? await this._applicantsRepo.delete(applicant.id)
                : await this._applicantsRepo.insert({ recruitId, userId });
        }
        catch (err) {

            if (err instanceof QueryFailedError)
                throw new NotFoundException();

            throw err;
        }
    }

    async getAppliedRecruits(userId: number): Promise<Recruit[]> {

        const applicants = await this._applicantsRepo.find({
            relations: { recruit: true },
            where: { userId },
            select: ["userId"]
        });

        return applicants.map(a => a.recruit);
    }

    didApplyToIt(recruitId: number, userId: number): Promise<boolean> {
        return this._applicantsRepo.existsBy({ recruitId, userId });
    }
}
