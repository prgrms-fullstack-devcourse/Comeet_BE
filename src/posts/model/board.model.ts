import { TypeBase } from "../../common/type";
import { Column, Entity } from "typeorm";

@Entity("boards")
export class Board extends TypeBase{
    @Column({ name: "is_recruit", type: "boolean" })
    isRecruit: boolean;
}