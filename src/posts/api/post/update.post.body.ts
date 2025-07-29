import { PartialType } from "@nestjs/swagger";
import { CreatePostBody } from "./create.post.body";

export class UpdatePostBody
    extends PartialType(CreatePostBody) {}