import { Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PostCategory } from "./post.category.model";
import { Comment } from "./comment.model";
import { BoardBase } from "../../common/board.base";

@Entity()
export class Post extends BoardBase {


    @ManyToOne(() => PostCategory)
    @JoinColumn({ name: "category_id" })
    category: PostCategory;

    @OneToMany(
        () => Comment,
        c => c.post,
        { cascade: true }
    )
    comments: Comment[];
}