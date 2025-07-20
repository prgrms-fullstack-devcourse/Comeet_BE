import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";

@Entity("socials")
export class Social extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: true })
    email: string;

    @Column({ type: "varchar", nullable: true })
    instagram: string;

    @Column({ name: "linked_in", type: "varchar", nullable: true })
    linkedin: string;

    @Column({ type: "varchar", nullable: true })
    blog: string;
}