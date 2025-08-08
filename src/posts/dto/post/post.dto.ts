import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../../common/geo";
import { BoardDTO } from "../board.dto";
import { UserBadge } from "../../../users/dto";
import { Type } from "class-transformer";

@ApiExtraModels(Coordinates, UserBadge, BoardDTO)
export class PostDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @Type(() => BoardDTO)
    @ApiProperty({ type: BoardDTO })
    board: BoardDTO;

    @Type(() => UserBadge)
    @ApiProperty({ type: UserBadge, nullable: true })
    author: UserBadge | null;

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