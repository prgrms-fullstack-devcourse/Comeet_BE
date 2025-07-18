import { Entity } from "typeorm";
import { TypeBase } from "../../common";

@Entity("post_categories")
export class PostCategory extends TypeBase {}