import { OmitType, PartialType } from "@nestjs/swagger";
import { CreatePostBody } from "./create.post.body";

export class UpdatePostBody extends PartialType(
    OmitType(CreatePostBody, ["categoryId"])
) {}