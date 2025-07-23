import { Column, Entity, Unique } from "typeorm";
import { MarkBase } from "../../common";

@Entity("like_marks")
@Unique(["tagetType", "targetId", "userId"])
export class LikeMark extends MarkBase {
    @Column({ name: "target_type", type: "varchar" })
    targetType: string;
}