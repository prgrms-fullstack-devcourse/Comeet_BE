import { Coordinates } from "../../../utils";

export interface SearchPostsDTO {
    categoryId?: number;
    userId?: number;
    keyword?: number;
    location?: Coordinates;
}