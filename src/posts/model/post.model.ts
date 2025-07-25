import { ModelBase } from "../../common/data";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./board.model";
import { User } from "../../users/model";

@Entity("posts")
export class Post extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "board_id", type: "integer" })
    boardId: number;

    @Column({ name: "user_id", type: "integer", nullable: true })
    userId: number | null;

    @Column({ name: "is_recruit", type: "boolean", default: false })
    isRecruit: boolean;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "text" })
    content: string;

    @ManyToOne(() => Board, { eager: true })
    @JoinColumn({ name: "board_id" })
    board: Board;

    @ManyToOne(() => User, { onDelete: "SET NULL" })
    @JoinColumn({ name: "user_id" })
    user: User | null;
}

