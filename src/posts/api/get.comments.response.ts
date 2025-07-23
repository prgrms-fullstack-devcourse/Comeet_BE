import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { CommentDTO } from "../dto";

@ApiExtraModels(CommentDTO)
export class GetCommentsResponse {
    @ApiProperty({ type: [CommentDTO] })
    results: CommentDTO[];
}