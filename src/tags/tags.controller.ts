import { Controller, Get, Inject, Query } from '@nestjs/common';
import { InterestsService, PositionsService, TechsService } from "./service";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { SearchTagsQuery, SearchTagsResponse } from "./api";

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

    @Get("/positions")
    @ApiOperation({ summary: "Get all positions" })
    @ApiOkResponse({ type: SearchTagsResponse })
    async getPositions(): Promise<SearchTagsResponse> {
        const results = await this._positionsService.getAllPositions();
        return { results };
    }

    @Get("/tech-stack")
    @ApiOperation({ summary: "Get tech stack containing given keyword" })
    @ApiQuery({ type: SearchTagsQuery, required: true })
    @ApiOkResponse({ type: SearchTagsResponse })
    @ApiUnprocessableEntityResponse({ description: "Invalid query parameters" })
    async getTechs(
        @Query()
        { keyword }: SearchTagsQuery
    ): Promise<SearchTagsResponse> {
        const results = await this._techsService.search(keyword);
        return { results };
    }

    @Get("/interests")
    @ApiOperation({ summary: "Get interests containing given keyword" })
    @ApiQuery({ type: SearchTagsQuery, required: true })
    @ApiOkResponse({ type: SearchTagsResponse })
    @ApiUnprocessableEntityResponse({ description: "Invalid query parameters" })
    async getInterests(
        @Query()
        { keyword }: SearchTagsQuery
    ): Promise<SearchTagsResponse> {
        const results = await this._interestsService.search(keyword);
        return { results };
    }
}
