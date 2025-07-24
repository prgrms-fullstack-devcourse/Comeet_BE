import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { GeoBase } from "../../common/data";
import { Social } from "./social.model";
import { Position } from "../../tags/model";
import { UserInterest, UserTech } from "./tag";

@Entity("users")
export class User extends GeoBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "github_id", type: "varchar", unique: true })
    githubId: string;

    @Column({ name: "social_id", type: "integer", unique: true })
    socialId: number;

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

    @Column({ type: "varchar" })
    githubLink: string;

    @OneToOne(() => Social, { cascade: true })
    @JoinColumn({ name: "social_id" })
    social: Social;

    @ManyToOne(() => Position)
    @JoinColumn({ name: "position_id" })
    position: Position;

    @OneToMany(
        () => UserTech,
        ut => ut.user,
        { cascade: true },
    )
    userTechs: UserTech[];

    @OneToMany(
        () => UserInterest,
        ui => ui.user,
        { cascade: true },
    )
    userInterests: UserInterest[];
}