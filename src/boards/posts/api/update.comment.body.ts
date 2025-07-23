import { PickType } from "@nestjs/swagger";
import { CreateCommentBody } from "./create.comment.body";

export class UpdateCommentBody
    extends PickType(CreateCommentBody, ["content"]) {}