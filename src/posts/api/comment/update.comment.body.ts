import { OmitType } from "@nestjs/swagger";
import { CreateCommentBody } from "./create.comment.body";

export class UpdateCommentBody extends OmitType(
    CreateCommentBody, ["postId"]
) {}