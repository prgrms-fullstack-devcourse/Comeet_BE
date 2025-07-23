import { PostDTO } from "./post.dto";
import { ApiProperty, PickType } from "@nestjs/swagger";

export class SearchPostResult extends PickType(
    PostDTO,
    ["id", "category", "author", "title", "createdAt", "nLikes"]
) {
    @ApiProperty({ type: "integer", description: "댓글 개수" })
    nComments: number;
}
