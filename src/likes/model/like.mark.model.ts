import { Column, Entity, Unique } from "typeorm";
import { MarkBase } from "../../common/data";

@Entity("like_marks")
export class LikeMark extends MarkBase {
    @Column({ name: "target_type", type: "varchar" })
    targetType: string;
}