import { TagDTO } from "../../tags/tag.dto";
import { GithubAccountDTO } from "../../github/dto";
import { Location } from "../../utils";

export interface UserDTO {
    id: number;
    nickname: string;
    location: Location;
    experience: number;
    bio: string | null;
    roles: TagDTO[];
    techs: TagDTO[];
    github: GithubAccountDTO;
}