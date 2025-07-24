import { SocialDTO } from "./social.dto";
import { TypeDTO } from "../../common/data";
import { PositionDTO } from "../../tags/dto";

export interface UserDTO {
    id: number;
    nickname: string;
    age: number;
    experience: number;
    bio: string;
    location: [number, number];
    githubLink: string;
    social: SocialDTO;
    position: PositionDTO;
    techStack: TypeDTO[];
    interests: TypeDTO[];
}