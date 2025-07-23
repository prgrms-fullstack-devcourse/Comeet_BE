import { SocialDTO } from "./social.dto";
import { TypeDTO } from "../../common";
import { GithubAccountDTO } from "../../github/dto";
import { PositionDTO } from "../../tags/dto";

export interface UserDTO {
    id: number;
    nickname: string;
    age: number;
    experience: number;
    bio: string;
    location: [number, number];
    social: SocialDTO;
    github: GithubAccountDTO;
    position: PositionDTO;
    techStack: TypeDTO[];
    interests: TypeDTO[];
}