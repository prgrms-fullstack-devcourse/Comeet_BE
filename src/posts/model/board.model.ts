import { TypeBase } from "../../common/data";
import { Entity, OneToMany } from "typeorm";
import { Post } from "./post.model";

@Entity("boards")
export class Board extends TypeBase {

    @OneToMany(
        () => Post,
        p => p.board
    )
    posts: Post[];
}