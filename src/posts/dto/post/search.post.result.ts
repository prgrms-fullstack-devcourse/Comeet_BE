import { PickType } from "@nestjs/swagger";
import { PostDTO } from "./post.dto";

export class SearchPostResult extends PickType(
  PostDTO,
  ["id", "board", "author", "title", "nLikes", "nComments", "location", "createdAt"]
) {}