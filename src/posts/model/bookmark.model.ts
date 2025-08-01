import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { MarkBase } from "../../common/marks";
import { Post } from "./post.model";

@Entity("bookmarks")
export class Bookmark extends MarkBase {
    @ManyToOne(() => Post, { onDelete: "CASCADE" })
    @JoinColumn({ name: "target_id" })
    target: Post;
}