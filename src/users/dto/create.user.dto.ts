import { SocialDTO } from "./social.dto";

export interface CreateUserDTO {
    githubId: string;
    nickname: string;
    age: number;
    experience: number;
    location: [number, number];
    positionId: number;
    techIds: number[];
    interestIds: number[];
    social?: Partial<SocialDTO>;
}