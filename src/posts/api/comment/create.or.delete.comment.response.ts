import { PickType } from "@nestjs/swagger";
import { PostCountDTO } from "../../dto";

export class CreateOrDeleteCommentResponse extends PickType(
    PostCountDTO, ["nComments"]
) {}