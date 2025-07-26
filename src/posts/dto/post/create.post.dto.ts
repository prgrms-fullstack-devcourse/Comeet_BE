import { Coordinates } from "../../../utils";

export interface CreatePostDTO {
    categoryId: number;
    userId: number;
    title: string;
    content: string;
    location?: Coordinates;
}