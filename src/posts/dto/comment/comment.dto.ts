import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { UserBadge } from "../../../users/dto";

@ApiExtraModels(UserBadge)
export class CommentDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "integer" })
    postId: number;

    @ApiProperty({ type: UserBadge, nullable: true })
    author: UserBadge | null;

    @ApiProperty({ type: "string" })
    content: string;

    @ApiProperty({ type: "boolean" })
    editable: boolean;

    @ApiProperty({ type: Date })
    createdAt: Date;
}