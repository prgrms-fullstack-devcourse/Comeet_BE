import { CommentDTO } from "../comment";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";

@ApiExtraModels(CommentDTO)
export class PostDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    category: string;

    @ApiProperty({ type: "string" })
    author: string;

    @ApiProperty({ type: "string" })
    title: string;

    @ApiProperty({ type: "string" })
    content: string | Buffer;

    @ApiProperty({ type: Date })
    createdAt: Date;

    @ApiProperty({ type: "boolean", description: "편집 가능 여부 <-> 본인이 작성한 글 여부" })
    editable: boolean;

    @ApiProperty({ type: "integer", description: "좋아요 수" })
    nLikes: number;

    @ApiProperty({ type: "boolean", description: "좋아요 눌렀는지 여부" })
    likeIt: boolean;

    @ApiProperty({ type: [CommentDTO] })
    comments: CommentDTO[];
}