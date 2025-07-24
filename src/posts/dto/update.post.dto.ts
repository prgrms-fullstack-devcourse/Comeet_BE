import { PostBaseDTO } from "./post.base.dto";
import { CreatePostDTO } from "./create.post.dto";

export type UpdatePostDTO<
    PostT extends PostBaseDTO,
    K extends keyof PostT = "title" | "content"
> = { id: number; userId: number; }
    & Partial<Omit<CreatePostDTO<PostT, K>, "userId" | "categoryId">>;