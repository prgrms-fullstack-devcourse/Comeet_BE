import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RecruitsService } from "../service";
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { GetRecruitsResponse } from "../api";
import { User } from "../../utils";

@Controller("/api/users/activities")
@UseGuards(AuthGuard("jwt"))
export class UserActivitiesController {

    constructor(
        @Inject(RecruitsService)
        private readonly _recruitsService: RecruitsService,
    ) {}

    @Get("/")
    @ApiOperation({ summary: "지원한 모집글 검색" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: GetRecruitsResponse })
    @ApiForbiddenResponse()
    async getUserRecruits(
        @User("id") userId: number
    ): Promise<GetRecruitsResponse> {
        const results= await this._recruitsService.searchAppliedRecruits(userId);
        return { results };
    }
}