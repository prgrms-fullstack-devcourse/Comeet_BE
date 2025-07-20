import { Column, Entity, Point, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { GithubAccount } from "../../github/model";
import { Social } from "./social.model";
import { Position } from "../../tags/model";
import { UserInterest, UserTech } from "./tag";

@Entity("users")
export class User extends ModelBase {
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

    @Column({ type: "integer" })
    age: number;

    @Column({ type: "integer" })
    experience: number;

    @Column({ type: "varchar" })
    bio: string;

    @Column({
        type: "geometry",
        spatialFeatureType: "Point",
        srid: 4326
    })
    location: Point;

    @OneToOne(() => GithubAccount, { onDelete: "CASCADE" })
    @JoinColumn({ name: "github_id" })
    github: GithubAccount;

    @OneToOne(() => Social, { onDelete: "CASCADE", cascade: ["insert"] })
    @JoinColumn({ name: "social_id" })
    social: Social;

    @ManyToOne(() => Position)
    @JoinColumn({ name: "position_id" })
    position: Position;

    @OneToMany(
        () => UserTech,
        ut => ut.user,
        { onDelete: "CASCADE", cascade: ["insert"] },
    )
    userTechs: UserTech[];

    @OneToMany(
        () => UserInterest,
        ui => ui.user,
        { onDelete: "CASCADE", cascade: ["insert"] },
    )
    userInterests: UserInterest[];
}