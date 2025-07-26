import { ModelBase } from "../../common/data";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostCategory } from "./post.category.model";
import { User } from "../../users/model";
import { Comment } from "./comment.model";
import { Applicant } from "./applicant.model";

@Entity("posts")
export class Post extends ModelBase{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "category_id", type: "integer" })
    categoryId: number;

    @Column({ name: "user_id", type: "integer", nullable: true })
    userId: number | null;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "text" })
    content: string;

    @Column({ name: "is_recruit", type: "boolean", default: false })
    isRecruit: boolean;

    @ManyToOne(() => PostCategory, { eager: true })
    @JoinColumn({ name: "category_id" })
    category: PostCategory;

    @ManyToOne(() => User, { onDelete: "SET NULL" })
    @JoinColumn({ name: "user_id" })
    user: User | null;

    @OneToMany(() => Comment, c => c.post, { cascade: true })
    comments: Comment[];

    @OneToMany(() => Applicant, a => a.post, { cascade: true })
    applicants: Applicant[];

}