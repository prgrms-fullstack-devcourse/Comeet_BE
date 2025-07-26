import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { BookmarkBase } from "../../common/bookmarks";
import { Post } from "./post.model";

@Entity("post_bookmarks")
export class PostBookmark extends BookmarkBase<Post> {
    @ManyToOne(() => Post, { onDelete: "CASCADE" })
    @JoinColumn({ name: "target_id" })
    target: Post;
}