import { PostCountDTO } from "./post.count.dto";

export type UpdatePostCountDTO
    = { postId: number; } & Partial<PostCountDTO>;