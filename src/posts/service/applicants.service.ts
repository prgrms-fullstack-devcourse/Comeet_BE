import { ConflictException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { MarksServiceBase } from "../../common/marks";
import { InjectRepository } from "@nestjs/typeorm";
import { Applicant, Post } from "../model";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PostCountsService } from "./post.counts.service";
import { plainToInstance } from "class-transformer";
import { UserBadge } from "../../common/badge";

@Injectable()
export class ApplicantsService extends MarksServiceBase {

    constructor(
        @InjectRepository(Applicant)
        protected readonly _repo: Repository<Applicant>,
        @InjectRepository(Post)
        private readonly _postsRepo: Repository<Post>,
        @Inject(PostCountsService)
        private readonly _countsService: PostCountsService,
    ) { super(); }

    @Transactional()
    async updateApply(postId: number, userId: number): Promise<boolean> {
        await this.canApply(postId);

        const delta = await this.updateMark(postId, userId);

        await this._countsService.updateCount({ postId, nApplicants: delta })
            .then(result => Logger.log(
                result,
                ApplicantsService.name
            )).catch(err => { throw err; });

        return delta === 1;
    }

    async getApplicants(postId: number): Promise<UserBadge[]> {

        const raws = await this.createSelectQueryBuilder()
            .where("applicant.targetId = :postId", { postId })
            .getRawMany();

        return raws.map(r => plainToInstance(UserBadge, r));
    }

    private async canApply(postId: number): Promise<void> {

        const post = await this._postsRepo.findOne({
            relations: { board: true },
            where: { id: postId },
            select: { board: { isRecruit: true } }
        });

        if (!post) throw new NotFoundException();
        if (!post.board.isRecruit) throw new ConflictException();
    }

    private createSelectQueryBuilder(): SelectQueryBuilder<Applicant> {
        return this._repo.createQueryBuilder("applicant")
            .innerJoin("applicant.user", "user")
            .select("user.nickname", "nickname")
            .addSelect("user.avatar", "avatar");
    }

}