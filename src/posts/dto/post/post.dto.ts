import { PostBaseDTO } from "../post.base.dto";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { CommentDTO } from "../comment";

@ApiExtraModels(CommentDTO)
export class PostDTO extends PostBaseDTO {
    @ApiProperty({ type: [CommentDTO] })
    comments: CommentDTO[];
}