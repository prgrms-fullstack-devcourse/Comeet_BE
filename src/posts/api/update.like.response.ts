import { ApiProperty, PickType } from "@nestjs/swagger";
import { PostDTO } from "../dto";

export class UpdateLikeResponse extends PickType(
    PostDTO, ["nLikes", "likeIt"]
) {}