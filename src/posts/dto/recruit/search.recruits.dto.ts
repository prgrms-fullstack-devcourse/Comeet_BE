import { PostBaseDTO } from "../post.base.dto";

export type SearchRecruitsDTO
    = PostBaseDTO.SearchDTO & { location?: [number, number]; };