import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common/data";

@Entity("socials")
export class Social extends ModelBase {
    @PrimaryGeneratedColumn({ name: "user_id" })
    userId: number;

    @Column({ type: "varchar", nullable: true })
    email: string | null;

    @Column({ type: "varchar", nullable: true })
    instagram: string | null;

    @Column({ name: "linked_in", type: "varchar", nullable: true })
    linkedIn: string | null;

    @Column({ type: "varchar", nullable: true })
    blog: string | null;
}