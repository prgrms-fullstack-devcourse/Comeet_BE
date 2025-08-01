import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags
} from "@nestjs/swagger";
import { Controller, Get, Inject, Param, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApplicantsService } from "../service";
import { UpdateApplyResponse } from "../api";
import { User } from "../../utils";
import { GetApplicantsResponse } from "../api/applicant";

@ApiTags("Posts", "Apply")
@Controller("/api/posts")
@UseGuards(AuthGuard("jwt"))
export class AppliesController {

    constructor(
        @Inject(ApplicantsService)
        private readonly _applicantsService: ApplicantsService,
    ) {}



    @Get("/:id/applicants")
    @ApiOperation({ summary: "지원자 목록 조회" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 아이디" })
    @ApiOkResponse({ type: GetApplicantsResponse })
    @ApiForbiddenResponse()
    async getApplicants(
        @Param("id") postId: number,
    ): Promise<GetApplicantsResponse> {
        const results = await this._applicantsService.getApplicants(postId);
        return { results };
    }

    @Put("/:id/applies")
    @ApiOperation({ description: "지원 상태 반전" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 아이디" })
    @ApiOkResponse({ type: UpdateApplyResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    async updateApply(
        @Param("id") postId: number,
        @User("id") userId: number,
    ): Promise<UpdateApplyResponse> {
        const applied = await this._applicantsService.updateApply(postId, userId);
        return { applied };
    }
}