import { Column, Entity } from "typeorm";
import { MarkBase } from "../../common/marks";

@Entity("like_marks")
export class LikeMark extends MarkBase {
    @Column({ name: "target_type", type: "varchar" })
    targetType: string;
}