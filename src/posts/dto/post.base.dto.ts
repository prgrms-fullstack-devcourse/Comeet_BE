import { ApiProperty } from "@nestjs/swagger";

type __SearchDTO = {
    categoryId: number;
    userId: number;
    keyword: string;
    createdAt: Date | [Date, Date];
};

export class PostBaseDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    category: string;

    @ApiProperty({ type: "string" })
    author: string;

    @ApiProperty({ type: "string" })
    title: string;

    @ApiProperty({ type: "string" })
    content: string | Buffer;

    @ApiProperty({ type: "integer" })
    nLikes: number;

    @ApiProperty({ type: "boolean" })
    likeIt: boolean;

    @ApiProperty({ type: "boolean" })
    editable: boolean;

    @ApiProperty({ type: Date })
    createdAt: Date;
}

export namespace PostBaseDTO {

    export type MutableKeys <PostT extends PostBaseDTO> = Exclude<
        keyof PostT,
        "id" | "category" | "author" | "nLikes" | "likeIt" | "editable" | "createdAt"
    >;

    export type CreateDTO<
        PostT extends PostBaseDTO,
        K extends MutableKeys<PostT>
    > = { categoryId: number; userId: number; }
        & Pick<PostT, "title" | "content" | K>;

    export type UpdateDTO<
        PostT extends PostBaseDTO,
        K extends MutableKeys<PostT>
    > = { id: number; userId: number; }
        & Partial<Omit<CreateDTO<PostT, K>, "userId" | "categoryId">>;

    export type SearchDTO = Partial<__SearchDTO>;
}

