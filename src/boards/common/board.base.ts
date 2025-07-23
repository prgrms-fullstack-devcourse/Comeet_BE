import { ModelBase, TypeBase } from "../../common/data";
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/model";

export abstract class BoardBase extends ModelBase {
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

    @ManyToOne(() => User, { onDelete: "SET NULL" })
    @JoinColumn({ name: "user_id" })
    user: User | null;

    abstract category: TypeBase;
}