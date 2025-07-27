import { UserDTO } from "./user.dto";

export type GetUserDTO
    = Pick<UserDTO, "id">
    | Pick<UserDTO, "githubId">
    | UserDTO;
