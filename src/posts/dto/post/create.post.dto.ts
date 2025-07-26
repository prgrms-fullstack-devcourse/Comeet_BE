import { Coordinates } from "../../../utils";

export interface CreatePostDTO {
    boardId: number;
    userId: number;
    title: string;
    content: string;
    location?: Coordinates;
}