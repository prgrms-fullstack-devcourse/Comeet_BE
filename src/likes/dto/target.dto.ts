import { LikeDTO } from "./like.dto";

export type TargetDTO = Omit<LikeDTO, "userId">;