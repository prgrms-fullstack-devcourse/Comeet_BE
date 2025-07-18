
export interface SearchPostsDTO {
    categoryId?: number;
    userId?: number;
    keyword?: string;
    createdAt?: Date | [Date, Date];
}