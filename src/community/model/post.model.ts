import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Point, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { PostCategory } from "./post.category.model";
import { Comment } from "./comment.model";

@Entity("posts")
export class Post extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "category_id", type: "integer" })
    categoryId: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "text" })
    content: string | Buffer;

    @Index()
    @Column({ type: "point", spatialFeatureType: "Point", srid: 4326 })
    location: Point;

    @ManyToOne(() => PostCategory)
    @JoinColumn({ name: "category_id" })
    category: PostCategory;

    @OneToMany(() => Comment, c => c.post)
    comments: Comment[];
}