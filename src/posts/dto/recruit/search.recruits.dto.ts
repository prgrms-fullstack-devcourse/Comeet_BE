import { PostDTO } from "../post.dto";

export type SearchRecruitsDTO
    = PostDTO.SearchDTO & { location?: [number, number]; };