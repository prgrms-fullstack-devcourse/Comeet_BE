import { ModelBase } from "../../common";
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/model";

export abstract class EditableBase extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "text" })
    content: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;
}