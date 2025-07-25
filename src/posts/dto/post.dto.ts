import { ApiProperty } from "@nestjs/swagger";

export class PostDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    board: string;

    @ApiProperty({ type: "string" })
    author: string;

    @ApiProperty({ type: "string" })
    title: string;

    @ApiProperty({ type: "string" })
    content: string | Buffer;

    @ApiProperty({
        type: "number",
        isArray: true,
        minLength: 2,
        maxLength: 2
    })
    location: [number, number] ;

    @ApiProperty({ type: "integer" })
    nLikes: number;

    @ApiProperty({ type: "boolean" })
    likeIt: boolean;

    @ApiProperty({ type: "boolean" })
    editable: boolean;

    @ApiProperty({ type: Date })
    createdAt: Date;
}
