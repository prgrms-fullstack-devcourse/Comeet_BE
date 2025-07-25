import { ApiProperty, PickType } from "@nestjs/swagger";
import { PostDTO } from "./post.dto";

export class SearchPostResult extends PickType(
    PostDTO,
    ["id", "board", "author", "title", "location", "nLikes", "createdAt"]
) {
    @ApiProperty({ type: "integer" })
    nComments: number;
}