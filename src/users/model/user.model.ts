import { Column, Entity, PrimaryGeneratedColumn, ValueTransformer } from "typeorm";
import { ModelBase } from "../../common/data";
import { Coordinates, GeometricColumn } from "../../common/geo";
import { PositionDTO } from "../../tags/dto";
import { TypeDTO } from "../../common/type";

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

@Entity("users")
export class User extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "github_id", type: "varchar", unique: true })
    githubId: string;

    @Column({ type: "varchar" })
    nickname: string;

    @Column({ name: "birthyear", type: "integer" })
    birthyear: number;

    @Column({ type: "integer" })
    experience: number;

    @Column({ type: "varchar" })
    bio: string;

    @GeometricColumn()
    location: Coordinates;

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

    @Column({ name: "n_subscribers", type: "integer", default: 0 })
    nSubscribers: number;

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