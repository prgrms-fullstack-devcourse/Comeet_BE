import { UserIdentificationDTO } from "../../users/dto";

export type TokenPayload
    = UserIdentificationDTO
    & Partial<{ salt: string; iat: number; exp: number; }>;