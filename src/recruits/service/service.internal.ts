import { LikeDTO, TargetDTO } from "../../likes/dto";

export function makeLike(id: number, userId: number): LikeDTO {
    return { ...makeTarget(id), userId };
}

export function makeTarget(id: number): TargetDTO {
    return { targetType: "recruit", targetId: id };
}