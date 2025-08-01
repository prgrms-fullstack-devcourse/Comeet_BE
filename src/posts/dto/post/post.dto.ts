import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../../common/geo";

@ApiExtraModels(Coordinates)
export class PostDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    board: string;

    @ApiProperty({ type: "string", nullable: true })
    author: string | null;

    @ApiProperty({ type: "string" })
    title: string;

    @ApiProperty({ type: "string" })
    content: string;

    @ApiProperty({ type: "boolean" })
    isRecruit: boolean;

    @ApiProperty({ type: Coordinates, nullable: true })
    location: Coordinates | null;

    @ApiProperty({ type: "integer", nullable: true })
    nComments: number | null;

    @ApiProperty({ type: "integer" })
    nLikes: number;

    @ApiProperty({ type: "boolean" })
    likeIt: boolean;

    @ApiProperty({ type: "boolean", nullable: true })
    applied: boolean | null;

    @ApiProperty({ type: "boolean" })
    bookmark: boolean;

    @ApiProperty({ type: "boolean" })
    editable: boolean;

    @ApiProperty({ type: Date })
    createdAt: Date;
}