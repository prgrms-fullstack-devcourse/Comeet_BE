import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Inject } from "@nestjs/common";
import { BoardsService } from "../service";
import { GetTypesResponse } from "../../common/type";

@ApiTags("Boards")
@Controller("/api/boards")
export class BoardsController {

    constructor(
       @Inject(BoardsService)
       private readonly _boardsService: BoardsService,
    ) {}

    @Get("/")
    @ApiOperation({ summary: "모든 게시판 반환" })
    @ApiOkResponse({ type: GetTypesResponse })
    async getAllBoards(): Promise<GetTypesResponse> {
        const results = await this._boardsService.getAll();
        return { results };
    }
}