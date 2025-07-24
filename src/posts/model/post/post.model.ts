import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "../../../users/model";
import { Comment } from "./comment.model";
import { PostBase } from "../post.base";

@Entity("posts")
export class Post extends PostBase {
    @Column({ name: "user_id", type: "integer", nullable: true })
    userId: number | null;

    @ManyToOne(() => User, { onDelete: "SET NULL" })
    @JoinColumn({ name: "user_id" })
    user: User | null;

    @OneToMany(
        () => Comment,
        c => c.post,
        { cascade: true }
    )
    comments: Comment[];
}