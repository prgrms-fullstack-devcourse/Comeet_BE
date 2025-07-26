import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common/data";
import { Coordinates, GeometricColumn } from "../../utils";

@Entity()
export class Developer extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "position_id", type: "integer" })
    positionId: number;

    @Column({ type: "varchar" })
    nickname: string;

    @Column({ name: "birth_year", type: "integer" })
    birthYear: number;

    @Column({ type: "integer" })
    experience: number;

    @Column({ type: "varchar" })
    bio: string;

    @GeometricColumn()
    location: Coordinates;

    @Column()
    nLikes: number;

    @Column({ type: "varchar" })
    github: string;

    @Column({ type: "varchar", nullable: true })
    email: string | null;

    @Column({ type: "varchar", nullable: true })
    instagram: string | null;

    @Column({ name: "linked_in", type: "varchar", nullable: true })
    linkedIn: string | null;

    @Column({ type: "varchar", nullable: true })
    blog: string | null;
}