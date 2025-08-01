import { ModelBase } from "../../common/data";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./board.model";
import { User } from "../../users/model";
import { PostCount } from "./post.count.model";
import { Coordinates, GeometricColumn } from "../../common/geo";

@Entity("posts")
export class Post extends ModelBase{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "board_id", type: "integer" })
    boardId: number;

    @Column({ name: "count_id", type: "integer" })
    countId: number;

    @Column({ name: "user_id", type: "integer", nullable: true })
    userId: number | null;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "text" })
    content: string;

    @GeometricColumn()
    location: Coordinates;

    @ManyToOne(() => Board, { eager: true })
    @JoinColumn({ name: "board_id" })
    board: Board;

    @OneToOne(() => PostCount, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "count_id" })
    count: PostCount;

    @ManyToOne(() => User, { onDelete: "SET NULL" })
    @JoinColumn({ name: "user_id" })
    user: User | null;
}