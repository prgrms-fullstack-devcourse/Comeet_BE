import { ModelBase } from "../../common/data";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./board.model";
import { User } from "../../users/model";
import { Comment } from "./comment.model";
import { Applicant } from "./applicant.model";

@Entity("posts")
export class Post extends ModelBase{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "board_id", type: "integer" })
    boardId: number;

    @Column({ name: "user_id", type: "integer", nullable: true })
    userId: number | null;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "text" })
    content: string;

    @Column({ name: "is_recruit", type: "boolean", default: false })
    isRecruit: boolean;

    @ManyToOne(() => Board, { eager: true })
    @JoinColumn({ name: "board_id" })
    board: Board;

    @ManyToOne(() => User, { onDelete: "SET NULL" })
    @JoinColumn({ name: "user_id" })
    user: User | null;

    @OneToMany(() => Comment, c => c.post, { cascade: true })
    comments: Comment[];

    @OneToMany(() => Applicant, a => a.post, { cascade: true })
    applicants: Applicant[];

}