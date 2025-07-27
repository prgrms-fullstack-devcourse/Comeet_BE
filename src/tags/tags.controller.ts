import { Controller, Get, Inject, Query } from '@nestjs/common';
import { InterestsService, PositionsService, TechsService } from "./service";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { GetAllPositionsAndInterestsResponse, SearchTechsQuery, SearchTechsResponse } from "./api";

@Controller('/api/tags')
@ApiTags("Tags")
export class TagsController {

    constructor(
       @Inject(PositionsService)
       private readonly _positionsService: PositionsService,
       @Inject(TechsService)
       private readonly _techsService: TechsService,
       @Inject(InterestsService)
       private readonly _interestsService: InterestsService,
    ) {}

    @Get("/positions-interests")
    @ApiOperation({ summary: "Get all positions and interests" })
    @ApiOkResponse({ type: GetAllPositionsAndInterestsResponse })
    async getPositionsAndInterests(): Promise<GetAllPositionsAndInterestsResponse> {
       const positions = await this._positionsService.getAllPositions();
       const interests = await this._interestsService.getAllInterests();
       return { positions, interests };
    }

    @Get("/tech-stack")
    @ApiOperation({ summary: "Get tech stack containing given keyword" })
    @ApiQuery({ type: SearchTechsQuery, required: true })
    @ApiOkResponse({ type: SearchTechsResponse })
    @ApiUnprocessableEntityResponse({ description: "Invalid query parameters" })
    async getTechs(
        @Query()
        { keyword }: SearchTechsQuery
    ): Promise<SearchTechsResponse> {
        const results = await this._techsService.searchTechs(keyword);
        return { results };
    }
}
