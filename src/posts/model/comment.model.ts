import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { Post } from "./post.model";
import { User } from "../../users/model";

@Entity("comments")
export class Comment extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "post_id", type: "integer" })
    postId: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "text" })
    content: string;

    @ManyToOne(() => Post, { onDelete: "CASCADE" })
    @JoinColumn({ name: "post_id" })
    post: Post;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;
}