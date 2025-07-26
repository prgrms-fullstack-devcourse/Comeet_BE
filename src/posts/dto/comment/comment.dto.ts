import { ApiProperty } from "@nestjs/swagger";

export class CommentDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "integer" })
    postId: number;

    @ApiProperty({ type: "string" })
    author: string;

    @ApiProperty({ type: "string" })
    content: string;

    @ApiProperty({ type: "boolean" })
    editable: boolean;

    @ApiProperty({ type: Date })
    createdAt: Date;
}