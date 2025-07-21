import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserTagBase } from "./user.tag.base";
import { Interest } from "../../../tags/model/interest.model";

@Entity("user_interests")
export class UserInterest extends UserTagBase {

    @Column({ name: "interest_id", type: "integer" })
    interestId: number;

    @ManyToOne(() => Interest)
    @JoinColumn({ name: "interest_id" })
    interest: Interest;
}