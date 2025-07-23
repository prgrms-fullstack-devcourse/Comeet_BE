

export interface CreateBoardDTO {
    categoryId: number;
    userId: number;
    title: string;
    content: string | Buffer;
}