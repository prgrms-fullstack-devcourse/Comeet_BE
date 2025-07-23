import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../../common";
import { PostCategory } from "./post.category.model";
import { User } from "../../../users/model";
import { Comment } from "./comment.model";

@Entity()
export class Post extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "category_id", type: "integer" })
    categoryId: number;

    @Column({ name: "user_id", type: "integer", nullable: true })
    userId: number | null;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "text" })
    content: string | Buffer;

    @ManyToOne(() => PostCategory)
    @JoinColumn({ name: "category_id" })
    category: PostCategory;

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