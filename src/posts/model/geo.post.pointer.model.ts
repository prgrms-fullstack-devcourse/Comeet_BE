import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GeometricColumn } from "../../utils";
import { Post } from "./post.model";

@Entity("geo_post_pointers")
export class GeoPostPointer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "post_id", type: "integer", unique: true })
    postId: number;

    @GeometricColumn()
    location: [number, number];

    @OneToOne(() => Post, { onDelete: "SET NULL" })
    @JoinColumn({ name: "post_id" })
    post: Post;
}