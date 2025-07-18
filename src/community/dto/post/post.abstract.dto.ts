import { PostDTO } from "./post.dto";

export type PostAbstractDTO
    = Omit<PostDTO, "content" | "comments" | "editable">
    & { nComments: number; };