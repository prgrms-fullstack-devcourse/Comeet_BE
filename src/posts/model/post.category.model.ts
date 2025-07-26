import { TypeBase } from "../../common/data";
import { Column, Entity } from "typeorm";

@Entity("post_categories")
export class PostCategory extends TypeBase{
    @Column({ name: "is_recruit", type: "boolean" })
    isRecruit: boolean;
}