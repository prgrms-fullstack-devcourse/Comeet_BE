import { Controller, Get, Inject, Param, Put } from "@nestjs/common";
import { ApplicantsService } from "../service";
import { User } from "../../utils";

@Controller("/api/boards/posts")
export class ApplicantsController {

    constructor(
       @Inject(ApplicantsService)
       private readonly _applicantsService: ApplicantsService,
    ) {}

    @Put("/:id/apply-or")
    async applyOr(
        @Param("id") postId: number,
        @User("id") userId: number,
    ) {
        await this._applicantsService.applyOrWithdraw(postId, userId);
    }

    @Get("/:id/applicants")
    async getApplicants(
        @Param("id") postId: number,
    ) {
        const results = await this._applicantsService.getApplicants(postId);
        return { results };
    }
}