import { SocialDTO } from "./social.dto";

export interface CreateUserDTO {
    githubId: string;
    githubLink: string;
    nickname: string;
    age: number;
    experience: number;
    bio: string;
    location: [number, number];
    positionId: number;
    techIds: number[];
    interestIds: number[];
    social: Partial<SocialDTO>;
}