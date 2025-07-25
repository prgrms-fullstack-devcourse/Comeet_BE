import { PickType } from "@nestjs/swagger";
import { PostBaseDTO } from "./post.base.dto";

export class SearchPostBaseResult extends PickType(
    PostBaseDTO,
    ["id", "category", "author", "title", "nLikes", "createdAt"]
) {}