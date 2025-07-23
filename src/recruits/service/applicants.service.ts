import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Applicant } from "../model";
import { Repository } from "typeorm";

@Injectable()
export class ApplicantsService {
    constructor(
       @InjectRepository(Applicant)
       private readonly _applicantsRepo: Repository<Applicant>,
    ) {}

    async applyOrQuit(recruitId: number, userId: number): Promise<void> {
        const applicant = await this._applicantsRepo.findOneBy({ recruitId, userId });

        applicant
            ? await this._applicantsRepo.delete(applicant.id)
            : await this._applicantsRepo.insert({ recruitId, userId });
    }

    didApplyToIt(recruitId: number, userId: number): Promise<boolean> {
        return this._applicantsRepo.existsBy({ recruitId, userId });
    }
}
