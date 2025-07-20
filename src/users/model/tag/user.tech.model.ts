import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserTagBase } from "./user.tag.base";
import { Tech } from "../../../tags/model";

@Entity("user_techs")
export class UserTech extends UserTagBase {
    @Column({ name: "tech_id", type: "integer" })
    techId: number;

    @ManyToOne(() => Tech)
    @JoinColumn({ name: "tech_id" })
    tech: Tech;
}