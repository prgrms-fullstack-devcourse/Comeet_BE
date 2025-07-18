import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ImmutableModelBase } from "../../common";
import { Post } from "./post.model";

@Entity("post_likes")
@Unique(["post_id", "user_id"])
export class PostLike extends ImmutableModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "post_id", type: "integer" })
    postId: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @ManyToOne(() => Post, { onDelete: "CASCADE" })
    @JoinColumn({ name: "post_id" })
    post: Post;
}