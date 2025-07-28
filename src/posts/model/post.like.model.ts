import { Entity } from "typeorm";
import { MarkBase } from "../../common/marks";

@Entity("post_likes")
export class PostLike extends MarkBase {}