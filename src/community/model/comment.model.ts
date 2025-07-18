import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Post } from "./post.model";
import { EditableBase } from "./editable.base";

@Entity("comments")
export class Comment extends EditableBase {

    @Column({ name: "post_id", type: "integer" })
    postId: number;

    @ManyToOne(() => Post, { onDelete: "CASCADE" })
    @JoinColumn({ name: "post_id" })
    post: Post;
}