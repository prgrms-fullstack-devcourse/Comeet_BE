import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ImmutableModelBase } from "../../common/data";
import { User } from "../../users/model";
import { Post } from "./post.model";

@Entity("applicants")
export class Applicant extends ImmutableModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "post_id", type: "integer" })
    postId: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Post, { onDelete: "CASCADE" })
    @JoinColumn({ name: "post_id" })
    post: Post;
}