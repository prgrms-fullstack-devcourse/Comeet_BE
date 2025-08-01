import { CreatePostDTO } from "./create.post.dto";
import { OmitType, PartialType } from "@nestjs/swagger";

export class UpdatePostDTO extends PartialType(
    OmitType(CreatePostDTO, ["boardId", "userId"])
)
{
    id: number;
    userId: number;
}
