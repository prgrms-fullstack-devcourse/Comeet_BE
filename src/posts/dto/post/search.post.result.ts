import { PostDTO } from "./post.dto";

export type SearchPostResult
    = Pick<PostDTO, "id" | "category" | "author" | "title" | "createdAt">
    & { nLikes: number; nComments: number; };