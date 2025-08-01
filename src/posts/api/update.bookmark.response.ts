import { PickType } from "@nestjs/swagger";
import { PostDTO } from "../dto";

export class UpdateBookmarkResponse
    extends PickType(PostDTO, ["bookmark"]) {}