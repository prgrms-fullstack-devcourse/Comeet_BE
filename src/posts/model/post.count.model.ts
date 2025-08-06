import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common/data";

@Entity("post_counts")
export class PostCount extends ModelBase {
    @PrimaryGeneratedColumn({ name: "id", type: "integer" })
    id: number;

    @Column({ name: "n_likes", type: "integer", default: 0 })
    nLikes: number;

    @Column({ name: "n_comments", type: "integer", default: 0 })
    nComments: number;

    @Column({ name: "n_applicants", type: "integer", default: 0 })
    nApplicants: number;
}