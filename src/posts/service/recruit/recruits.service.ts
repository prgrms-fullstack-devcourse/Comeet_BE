import { PostsServiceBase } from "../posts.service.base";
import { PostDTO, RecruitDTO, SearchRecruitResult, SearchRecruitsDTO } from "../../dto";
import {  Inject, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Recruit } from "../../model";
import { Repository } from "typeorm";
import { LikesService } from "../../../likes";
import { ApplicantsService } from "./applicants.service";
import { SearchRecruitsService } from "./search.recruits.service";
import { ApplicantDTO } from "../../dto";
import { pick } from "../../../utils/object";

export class RecruitsService
    extends PostsServiceBase<RecruitDTO, "location">
{
    protected readonly _postType = "recruit";
    private readonly _logger: Logger = new Logger(RecruitsService.name);

    constructor(
        @InjectRepository(Recruit)
        protected readonly _repo: Repository<Recruit>,
        @Inject(LikesService)
        protected readonly _likesService: LikesService,
        @Inject(ApplicantsService)
        private readonly _applicantsService: ApplicantsService,
        @Inject(SearchRecruitsService)
        private readonly _searchRecruitsService: SearchRecruitsService,
    ) { super(); }

    async getPost(id: number, userId: number): Promise<RecruitDTO> {

        const post = await this._repo.findOne({
            relations: { applicants: true },
            where: { id }
        });

        if (!post) throw new NotFoundException();
        return this.toDTO(post, userId);
    }

    async searchPosts(dto: SearchRecruitsDTO): Promise<SearchRecruitResult[]> {

        const posts = await this._searchRecruitsService
            .searchRecruits(dto);

        return Promise.all(
            posts.map(post =>
                this.toSearchResult(post)
            )
        );
    }

    async createPost(
        dto: PostDTO.CreateDTO<RecruitDTO, "location">
    ): Promise<void> {
        await super.createPost(dto);
    }

    async updatePost(
        dto: PostDTO.UpdateDTO<RecruitDTO, "location">
    ): Promise<void> {
        await super.updatePost(dto);
    }

    async searchAppliedRecruits(userId: number): Promise<SearchRecruitResult[]> {
        const posts = await this._applicantsService.getAppliedRecruits(userId);

        return Promise.all(
            posts.map(post =>
                this.toSearchResult(post)
            )
        );

    }

    async applyOrQuitRecruit(id: number, userId: number): Promise<void> {
        await this._applicantsService.applyOrQuit(id, userId);
    }

    async getApplicants(id: number, userId: number): Promise<ApplicantDTO[]> {

        const post = await this._repo.findOne({
            relations: { applicants: { user: true } },
            where: { id, userId },
            select: ["id", "userId", "applicants"]
        });

        if (!post) throw new NotFoundException();

        return post.applicants.map(({ user }) =>
            pick(user, ["id", "nickname"])
        );
    }

    protected async toDTO(
        post: Recruit,
        userId: number
    ): Promise<RecruitDTO> {
        return {
            ...await super.toDTO(post, userId),
            location: post.location,
            applied: await this._applicantsService.didApplyToIt(post.id, userId)
        };
    }

    protected async toSearchResult(post: Recruit): Promise<SearchRecruitResult> {
        return {
            ...await super.toSearchResult(post),
            location: post.location
        };
    }
}