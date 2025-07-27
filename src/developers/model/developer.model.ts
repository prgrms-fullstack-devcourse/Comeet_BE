import { Column, Entity, PrimaryGeneratedColumn, ValueTransformer } from "typeorm";
import { ModelBase, TypeDTO } from "../../common/data";
import { Coordinates, GeometricColumn } from "../../utils";
import { PositionDTO } from "../../tags/dto";

const __transformer: ValueTransformer = {
    from(hstore: Record<string, string>): TypeDTO[] {
        return Object.entries(hstore)
            .map(([k, v]): TypeDTO =>
                ({ id: Number(k), value: v })
            );
    },
    to(tags: TypeDTO[]): Record<string, string> {
        return Object.fromEntries(
            tags.map(tag =>
                [tag.id.toString(), tag.value]
            )
        );
    }
};

@Entity("developers")
export class Developer extends ModelBase {
    @PrimaryGeneratedColumn({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "varchar" })
    nickname: string;

    @Column({ name: "birth_year", type: "integer" })
    birthYear: number;

    @Column({ type: "integer" })
    experience: number;

    @Column({ type: "jsonb" })
    position: PositionDTO;

    @Column({
        name: "tech_stack",
        type: "hstore",
        hstoreType: "object",
        transformer: __transformer,
    })
    techStack: TypeDTO[];

    @Column({
        type: "hstore",
        hstoreType: "object",
        transformer: __transformer,
    })
    interests: TypeDTO[];

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