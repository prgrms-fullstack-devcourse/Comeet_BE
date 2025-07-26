import { ModelBase } from "../../common/data";
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Coordinates, GeometricColumn } from "../../utils";
import { Post } from "./post.model";

@Entity("geo_post_pointers")
export class GeoPostPointer extends ModelBase {
    @PrimaryColumn({ name: "post_id", type: "integer" })
    postId: number;

    @GeometricColumn()
    location: Coordinates;

    @OneToOne(() => Post, { eager: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "post_id" })
    post: Post;
}