import {
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags
} from "@nestjs/swagger";
import { Controller, Inject, Param, Put, UseGuards } from "@nestjs/common";
import { PostLikesService } from "../service";
import { UpdateLikeResponse } from "../api";
import { User } from "../../utils";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Posts", "Likes")
@Controller("/api/posts")
@UseGuards(AuthGuard("jwt"))
export class PostLikesController {

    constructor(
        @Inject(PostLikesService)
        private readonly _likesService: PostLikesService,
    ) {}

    @Put("/:id/likes")
    @ApiOperation({ description: "좋아요 상태 반전" })
    @ApiParam({ name: "id", type: "integer", required: true, description: "게시물 아이디" })
    @ApiOkResponse({ type: UpdateLikeResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    async updateLike(
        @Param("id") postId: number,
        @User("id") userId: number,
    ): Promise<UpdateLikeResponse> {
        const [nLikes, likeIt] = await  this._likesService.updateLike(postId, userId);
        return { nLikes, likeIt };
    }
}