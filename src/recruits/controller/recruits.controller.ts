import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse,
    ApiOperation, ApiParam, ApiQuery, ApiResetContentResponse,
    ApiTags, ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { RecruitsService } from "../service";
import {
    CreateRecruitBody, GetApplicantsResponse,
    GetRecruitsQuery,
    GetRecruitsResponse,
    UpdateRecruitBody,
    UpdateRecruitLikeResponse
} from "../api";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../../utils";
import { RecruitDTO } from "../dto";

@ApiTags("Recruits")
@Controller("/api/recruits")
@UseGuards(AuthGuard("jwt"))
export class RecruitsController {

    constructor(
       @Inject(RecruitsService)
       private readonly _recruitsService: RecruitsService,
    ) {}

    @Post("/")
    @ApiOperation({ summary: "모집글 생성" })
    @ApiBearerAuth()
    @ApiBody({ type: CreateRecruitBody, required: true })
    @ApiCreatedResponse()
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    async createRecruit(
        @User("id") userId: number,
        @Body() body: CreateRecruitBody,
    ) {
        await this._recruitsService.createRecruit({
            userId, ...body
        });
    }

    @Get("/")
    @ApiOperation({ summary: "모집글 조회" })
    @ApiBearerAuth()
    @ApiQuery({ type: GetRecruitsQuery, required: true })
    @ApiOkResponse({ type: GetRecruitsResponse })
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    async getRecruits(
        @Query() query: GetRecruitsQuery,
    ): Promise<GetRecruitsResponse> {
        const results = await this._recruitsService.searchRecruits(query);
        return { results };
    }

    @Get("/:id")
    @ApiOperation({ summary: "모집글 조회" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", description: "모집글 id", required: true })
    @ApiOkResponse({ type: RecruitDTO })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    async getRecruit(
        @Param("id") id: number,
        @User("id") userId: number,
    ): Promise<RecruitDTO> {
        return await this._recruitsService.getRecruit(id, userId);
    }

    @Patch("/:id")
    @ApiOperation({ summary: "모집글 수정" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", description: "모집글 id", required: true })
    @ApiBody({ type: UpdateRecruitBody, required: true })
    @ApiResetContentResponse()
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    async updateRecruit(
        @Param("id") id: number,
        @User("id") userId: number,
        @Body() body: UpdateRecruitBody,
    ): Promise<void> {
        await this._recruitsService.updateRecruit({
            id, userId, ...body
        });
    }

    @Delete("/:id")
    @ApiOperation({ summary: "모집글 삭제" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", description: "모집글 id", required: true })
    @ApiNoContentResponse()
    @ApiForbiddenResponse()
    async deleteRecruit(
        @Param("id") id: number,
        @User("id") userId: number,
        @Body() body: UpdateRecruitBody,
    ): Promise<void> {
        await this._recruitsService.deleteRecruit(id, userId);
    }

    @Put("/:id/likes")
    @ApiOperation({ summary: "모집글 좋아요/좋아요 해제" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", description: "모집글 id", required: true })
    @ApiOkResponse({ type: UpdateRecruitLikeResponse })
    @ApiForbiddenResponse()
    async updateRecruitLike(
        @Param("id") id: number,
        @User("id") userId: number,
    ): Promise<UpdateRecruitLikeResponse> {
        const nLikes = await this._recruitsService.updateRecruitLike(id, userId);
        return { nLikes };
    }

    @Put("/:id/apply")
    @ApiOperation({ summary: "모집글 좋아요/좋아요 해제" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", description: "모집글 id", required: true })
    @ApiResetContentResponse()
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    async applyOrQuitRecruit(
        @Param("id") id: number,
        @User("id") userId: number,
    ): Promise<void> {
        await this._recruitsService.applyOrQuitRecruit(id, userId);
    }

    @Get("/:id/applicants")
    @ApiOperation({ summary: "지원자 조회" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", description: "모집글 id", required: true })
    @ApiOkResponse({ type: GetApplicantsResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    async getApplicants(
        @Param("id") id: number,
        @User("id") userId: number,
    ): Promise<GetApplicantsResponse> {
        const results = await this._recruitsService.getApplicants(id, userId);
        return { results };
    }


}