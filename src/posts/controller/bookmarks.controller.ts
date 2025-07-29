import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags
} from "@nestjs/swagger";
import { Controller, Inject, Param, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BookmarksService } from "../service";
import { UpdateBookmarkResponse } from "../api";
import { User } from "../../utils";

@ApiTags("Posts", "Bookmarks")
@Controller("/api/posts")
@UseGuards(AuthGuard("jwt"))
export class BookmarksController {

    constructor(
       @Inject(BookmarksService)
       private readonly _bookmarksService: BookmarksService,
    ) {}



    @Put("/:id/bookmarks")
    @ApiOperation({ description: "북마크 상태 반전" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 아이디" })
    @ApiOkResponse({ type: UpdateBookmarkResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    async updateBookmark(
        @Param("id") postId: number,
        @User("id") userId: number,
    ): Promise<UpdateBookmarkResponse> {
        const bookmark = await this._bookmarksService.updateBookmark(postId, userId);
        return { bookmark };
    }

}