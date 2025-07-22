import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ImmutableModelBase } from "../../common";
import { Post } from "./post.model";
import { User } from "../../users/model";

@Entity("post_likes")
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

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;
}