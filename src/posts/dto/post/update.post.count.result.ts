import { PostCountDTO } from "./post.count.dto";
import { PickType } from "@nestjs/swagger";

export function UpdatePostCountResult(keys: Array<keyof PostCountDTO>) {
    return class extends PickType(PostCountDTO, keys)  {};
}