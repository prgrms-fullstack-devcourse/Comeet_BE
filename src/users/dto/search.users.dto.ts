
export interface SearchUsersDTO {
    id: number;
    radius: number;
    age?: [number, number];
    experience?: [number, number];
    positionIds?: number[];
    techIds?: number[];
    institutionIds?: number[];
}