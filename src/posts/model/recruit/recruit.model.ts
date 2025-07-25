import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "../../../users/model";
import { Applicant } from "./applicant.model";
import { PostBase } from "../post.base";
import { GeometricColumn } from "../../../utils";

@Entity("recruits")
export class Recruit extends PostBase {
    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @GeometricColumn()
    location: [number, number];

    @ManyToOne(() => User, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(
        () => Applicant,
        p => p.recruit,
        { cascade: true }
    )
    applicants: Applicant[];
}