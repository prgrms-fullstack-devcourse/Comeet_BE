import { UserIdentification } from "./user.identification";

export type GetUserDTO
    = Pick<UserIdentification, "id">
    | Pick<UserIdentification, "githubId">
    | UserIdentification;