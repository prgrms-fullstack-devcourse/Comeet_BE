import { PostBaseDTO } from "./post.base.dto";

type __Mapped<PostT extends PostBaseDTO>
    = { [K in keyof PostT]: any; };

type __SearchDTO = {
    categoryId: number;
    userId: number;
    keyword: string;
    createdAt: Date | [Date, Date];
};

export type SearchPostsDTO<
    PostT extends PostBaseDTO,
    Q extends __Mapped<PostT>
> = Partial<__SearchDTO & Q>;