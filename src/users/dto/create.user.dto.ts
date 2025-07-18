import { Location } from "../../utils";

export interface CreateUserDTO {
    githubId: string;
    nickname: string;
    experience: number;
    location: Location;
    bio?: string;
    roleIds: number[];
    techIds: number[];
}