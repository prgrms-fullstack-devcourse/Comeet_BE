import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Applicant, Post } from "../model";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { ApplicantDTO } from "../dto";
import { pick } from "../../utils/object";

@Injectable()
export class ApplicantsService {

    constructor(
       @InjectRepository(Applicant)
       private readonly _applicantsRepo: Repository<Applicant>,
       @InjectRepository(Post)
       private readonly _postsRepo: Repository<Post>,
    ) {}

    @Transactional()
    async applyOrWithdraw(postId: number, userId: number): Promise<void> {
        const applicant = await this._applicantsRepo.findOneBy({ postId, userId });

        if (applicant) {
            await this._applicantsRepo.delete(applicant.id);
        }
        else {
            const exists = await this._postsRepo
                .existsBy({ id: postId, isRecruit: true });

            exists && await this._applicantsRepo.insert({ postId, userId });
        }
    }

    async getApplicants(postId: number): Promise<ApplicantDTO[]> {

        const applicants = await this._applicantsRepo.find({
            relations: { user: true },
            where: { postId }
        });

        return applicants.map(applicant =>
            pick(applicant.user, ["id", "nickname"])
        );
    }

    didApplyToIt(postId: number, userId: number): Promise<boolean> {
        return this._applicantsRepo.existsBy({ postId, userId });
    }
}