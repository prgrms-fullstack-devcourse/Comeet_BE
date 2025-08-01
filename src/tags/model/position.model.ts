import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ModelBase } from "../../common/data";

@Entity("positions")
@Unique(["field", "role"])
export class Position extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    field: string;

    @Column({ type: "varchar" })
    role: string;
}