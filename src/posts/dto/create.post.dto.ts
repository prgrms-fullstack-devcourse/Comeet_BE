import { PostBaseDTO } from "./post.base.dto";

export type CreatePostDTO<
    PostT extends PostBaseDTO,
    K extends keyof PostT = "title" | "content"
> = { categoryId: number; userId: number; }
    & Pick<PostT, "title" | "content" | K>;