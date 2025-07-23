import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RecruitsService } from "../service";
import { User } from "../../utils";
import { GetRecruitsResponse } from "../api";

@ApiTags("Users", "Recruits")
@Controller("/api/users/recruits")
@UseGuards(AuthGuard("jwt"))
export class UserRecruitsController {

    constructor(
        @Inject(RecruitsService)
        private readonly _recruitsService: RecruitsService,
    ) {}

    @Get("/")
    @ApiOperation({ summary: "작성한 모집글 검색" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: GetRecruitsResponse })
    @ApiForbiddenResponse()
    async getUserRecruits(
        @User("id") userId: number
    ): Promise<GetRecruitsResponse> {
        const results= await this._recruitsService.searchRecruits({ userId });
        return { results };
    }
}