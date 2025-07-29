import { UserCert } from "./user.cert";

export type GetUserDTO
    = Pick<UserCert, "id">
    | Pick<UserCert, "githubId">
    | UserCert;
