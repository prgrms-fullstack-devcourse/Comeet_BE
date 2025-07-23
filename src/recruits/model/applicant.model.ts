import { ImmutableModelBase } from "../../common/data";
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/model";
import { Recruit } from "./recruit.model";

export class Applicant extends ImmutableModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "recruit_id", type: "integer" })
    recruitId: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @ManyToOne(() => Recruit, { onDelete: "CASCADE" })
    @JoinColumn({ name: "recruit_id" })
    recruit: Recruit;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;
}