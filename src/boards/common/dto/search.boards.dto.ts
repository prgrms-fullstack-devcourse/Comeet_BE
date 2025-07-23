
export interface SearchBoardsDTO {
    ids?: number[];
    categoryId?: number;
    userId?: number;
    keyword?: string;
    createdAt?: [Date, Date];
}