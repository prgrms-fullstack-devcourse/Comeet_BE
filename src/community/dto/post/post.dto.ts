import { CommentDTO } from "../comment";

export interface PostDTO {
    id: number;
    title: string;
    content: string | Buffer;
    likes: number;
    createdAt: Date;
    comments: CommentDTO[];
    editable: boolean;
    likedIt: boolean;
}