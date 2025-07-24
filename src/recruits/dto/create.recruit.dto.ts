export interface CreateRecruitDTO {
    categoryId: number;
    userId: number;
    title: string;
    detail: string;
    location: [number, number];
}