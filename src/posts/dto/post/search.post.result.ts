import { PickType } from "@nestjs/swagger";
import { PostDTO } from "./post.dto";

export class SearchPostResult extends PickType(
  PostDTO,
  ["id", "category", "author", "title", "nLikes", "nComments", "location", "createdAt"]
) {}