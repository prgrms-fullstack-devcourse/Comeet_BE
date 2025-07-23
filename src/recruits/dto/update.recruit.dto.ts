
export interface UpdateRecruitDTO {
    id: number;
    userId: number;
    title?: string;
    detail?: string;
    location?: [number, number];
}