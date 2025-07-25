import { ModelBase } from "../../common/data";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("post_commons")
export class PostCommon extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    title: string;

    @Column({ type: "text" })
    content: string | Buffer;
}