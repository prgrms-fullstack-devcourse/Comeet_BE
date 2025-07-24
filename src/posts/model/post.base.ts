import { ModelBase } from "../../common/data";
import { Column, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostCategory } from "./post.category.model";
import { PostCommon } from "./post.common.model";

export abstract class PostBase extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "category_id", type: "integer" })
    categoryId: number;

    @Column({ name: "common_id", type: "integer" })
    commonId: number;

    @ManyToOne(() => PostCategory)
    @JoinColumn({ name: "category_id" })
    category: PostCategory;

    @OneToOne(() => PostCommon, { onDelete: "CASCADE", cascade: true })
    @JoinColumn({ name: "common_id" })
    common: PostCommon;
}