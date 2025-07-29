import { PickType } from "@nestjs/swagger";
import { CommentDTO } from "../../dto";

export class UpdateCommentResponse
    extends PickType(CommentDTO, ["content"]) {}