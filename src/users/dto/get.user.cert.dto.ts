import { CreateUserDTO } from "./create.user.dto";

export type GetUserCertDTO
    = Pick<CreateUserDTO, "githubId" | "picture" | "github">;