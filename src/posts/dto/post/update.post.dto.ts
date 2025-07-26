import { CreatePostDTO } from "./create.post.dto";

export type UpdatePostDTO
    = { id: number; userId: number; }
    & Partial<Omit<CreatePostDTO, "boardId" | "userId">>;