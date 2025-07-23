import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GeoBase } from "../../common/data";
import { RecruitCategory } from "./recruit.category.model";
import { User } from "../../users/model";
import { Applicant } from "./applicant.model";

@Entity("recruits")
export class Recruit extends GeoBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "category_id", type: "integer" })
    categoryId: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "text" })
    detail: string;

    @ManyToOne(() => RecruitCategory)
    @JoinColumn({ name: "category_id" })
    category: RecruitCategory;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(
        () => Applicant,
        p => p.recruit,
        { cascade: true }
    )
    applicants: Applicant[];
}