import { CommentDTO } from "../comment";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { BoardDTO } from "../../../common/dto";

@ApiExtraModels(CommentDTO)
export class PostDTO extends BoardDTO {
    @ApiProperty({ type: [CommentDTO] })
    comments: CommentDTO[];
}