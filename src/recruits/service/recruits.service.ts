import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Recruit } from "../model";
import { Repository } from "typeorm";
import { ApplicantsService } from "./applicants.service";
import { LikesService } from "../../likes";
import { CreateRecruitDTO, RecruitDTO, SearchRecruitsDTO, UpdateRecruitDTO } from "../dto";
import { pick } from "../../utils/object";
import { makeLike } from "./service.internal";
import { SearchRecruitsService } from "./search.recruits.service";
import { ApplicantDTO } from "../dto/applicant.dto";

@Injectable()
export class RecruitsService {
    private readonly _logger: Logger = new Logger(RecruitsService.name);

    constructor(
       @InjectRepository(Recruit)
       private readonly _recruitsRepo: Repository<Recruit>,
       @Inject(ApplicantsService)
       private readonly _applicantsService: ApplicantsService,
       @Inject(LikesService)
       private readonly _likesService: LikesService,
       @Inject(SearchRecruitsService)
       private readonly _searchRecruitsService: SearchRecruitsService,
    ) {}

    async createRecruit(dto: CreateRecruitDTO): Promise<void> {
        const recruit = await this._recruitsRepo.save(dto);
        this._logger.log(recruit);
    }

    async getRecruit(id: number, userId: number): Promise<RecruitDTO> {

        const recruit = await this._recruitsRepo.findOne({
            relations: { category: true, user: true },
            where: { id }
        });

        if (!recruit) throw new NotFoundException();
        return this.toRecruitDTO(recruit, userId);
    }

    async updateRecruit(dto: UpdateRecruitDTO): Promise<void> {
        const { id, userId, ...values } = dto;
        await this._recruitsRepo.update({ id, userId }, values);
    }

    async deleteRecruit(id: number, userId: number): Promise<void> {
        await this._recruitsRepo.delete({ id, userId });
    }

    searchRecruits(dto: SearchRecruitsDTO): Promise<SearchRecruitsDTO[]> {
        return this._searchRecruitsService.searchRecruit(dto);
    }

    async applyOrQuitRecruit(recruitId: number, userId: number): Promise<void> {
        await this._applicantsService.applyOrQuit(recruitId, userId);
    }

    async getApplicants(id: number, userId: number): Promise<ApplicantDTO[]> {

        const recruit = await this._recruitsRepo.findOne({
            relations: { applicants: { user: true } },
            where: { id },
            select: ["id", "userId", "applicants"]
        });

        if (!recruit) throw new NotFoundException();
        if (recruit.userId !== userId) throw new ForbiddenException();

        return recruit.applicants.map(({ user }) =>
            pick(user, ["id", "nickname"])
        );
    }

    private async toRecruitDTO(recruit: Recruit, userId: number): Promise<RecruitDTO> {
        const category = recruit.category.value;
        const author = recruit.user.nickname;
        const editable = recruit.userId === userId;

        const [nLikes, likeIt] = await this._likesService
            .countAndCheckLike(makeLike(recruit.id, userId));

        const applied = await this._applicantsService
            .didApplyToIt(recruit.id, userId);

        return {
            ...pick(recruit, ["id", "title", "detail", "location", "createdAt"]),
            category, author, editable, nLikes, likeIt, applied
        };
    }
}

