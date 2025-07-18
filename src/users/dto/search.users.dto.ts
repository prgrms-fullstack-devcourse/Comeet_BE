export interface SearchUsersDTO {
    id: number;
    radius: number;
    experience?: [number, number];
    roleIds?: number[];
    techIds?: number[];
}