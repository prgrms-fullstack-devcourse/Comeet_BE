
export interface CreatePostDTO {
    categoryId: number;
    userId: number;
    title: string;
    content: string | Buffer;
}