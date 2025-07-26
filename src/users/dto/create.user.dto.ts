import { Coordinates } from "../../utils";


export interface CreateUserDTO {
    nickname: string;
    age: number;
    experience: number;
    bio: string;
    location: Coordinates;
    techIds: number[];
    interestIds: number[];
    positionId: number;
    githubId: string;
    github: string;
    email?: string;
    linkedIn?: string;
    instagram?: string;
    blog?: string;
}