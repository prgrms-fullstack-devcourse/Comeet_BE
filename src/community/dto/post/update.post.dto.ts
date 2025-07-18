export interface UpdatePostDTO {
    id: number;
    userId: number;
    title?: string;
    content?: string | Buffer;
}