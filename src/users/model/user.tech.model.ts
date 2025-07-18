import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column } from "typeorm";
import { Tech } from "../../tags/model";
import { User } from "./user.model";
import { ImmutableModelBase } from "../../common";

@Entity("user_techs")
export class UserTech extends ImmutableModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ name: "tech_id", type: "integer" })
    techId: number;

    @ManyToOne(() => User, { onDelete: "CASCADE", cascade: ["insert", "update"] })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Tech, { eager: true })
    @JoinColumn({ name: "tech_id" })
    tech: Tech;
}