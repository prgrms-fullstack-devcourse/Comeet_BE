import { CreateUserDTO } from "./create.user.dto";

export type UpdateUserDTO
    = { id: number; } & Partial<Omit<CreateUserDTO, "githubId" | "githubLink">>;