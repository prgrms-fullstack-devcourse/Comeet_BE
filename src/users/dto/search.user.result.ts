import { UserDTO } from "./user.dto";

export type SearchUserResult
    = { distance: number; }
    & Pick<UserDTO, "id" | "nickname" | "age" | "experience" | "location" | "githubLink" | "position" | "techStack" | "interests">
