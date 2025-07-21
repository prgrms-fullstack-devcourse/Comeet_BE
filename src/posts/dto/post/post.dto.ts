import { CommentDTO } from "../comment";

export interface PostDTO {
    id: number;
    category: string;
    author: string;
    title: string;
    content: string;
    createdAt: Date;
    editable: boolean;
    nLikes: number;
    likeIt: boolean;
    comments: CommentDTO[];
}