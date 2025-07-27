import { CreateUserDTO } from "../../users/dto";

export type UpdateDeveloperDTO
    = { userId: number; }
    & Partial<Omit<CreateUserDTO, "githubId" | "github" | "birthYear">>;