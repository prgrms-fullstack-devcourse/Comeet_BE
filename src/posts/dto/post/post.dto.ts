import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../../utils";

@ApiExtraModels(Coordinates)
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
    content: string;

    @ApiProperty({ type: Coordinates, nullable: true })
    location: Coordinates | null;

    @ApiProperty({ type: "integer", nullable: true })
    nComments: number | null;

    @ApiProperty({ type: "integer" })
    nLikes: number;

    @ApiProperty({ type: "boolean" })
    likeIt: boolean;

    @ApiProperty({ type: "boolean" })
    editable: boolean;

    @ApiProperty({ type: "boolean", nullable: true })
    applied: boolean | null;

    @ApiProperty({ type: Date })
    createdAt: Date;
}