import { UserDTO } from "./user.dto";

export type UserAbstractDTO = Omit<UserDTO, "github">;