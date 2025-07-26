import { Coordinates } from "../../../utils";

export interface SearchPostsDTO {
    boardId?: number;
    userId?: number;
    keyword?: string;
    location?: Coordinates;
}