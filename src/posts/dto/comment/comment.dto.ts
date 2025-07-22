import { ApiProperty } from "@nestjs/swagger";

export class CommentDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    author: string;

    @ApiProperty({ type: "string" })
    content: string;

    @ApiProperty({ type: Date })
    createdAt: Date;

    @ApiProperty({ type: "boolean", description: "좋아요 눌렀는지 여부" })
    editable: boolean;
}