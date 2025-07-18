import { CreateCommentDTO } from "./create.comment.dto";

export type UpdateCommentDTO
    = { id: number; } & Omit<CreateCommentDTO, "postId">;