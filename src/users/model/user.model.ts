import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, Point, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { GitHubAccount } from "../../github/model";
import { UserRole } from "./user.role.model";
import { UserTech } from "./user.tech.model";


@Entity("users")
export class User extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ name: "github_id", type: "bigint", unique: true })
    githubId: string;

    @Column({ type: "varchar" })
    nickname: string;

    @Index()
    @Column({ type: "point", spatialFeatureType: "Point", srid: 4326 })
    location: Point;

    @Column({ type: "integer", unsigned: true })
    experience: number;

    @Column({ type: "varchar", nullable: true })
    bio: string | null;

    @OneToOne(() => GitHubAccount, { onDelete: "CASCADE" })
    @JoinColumn({ name: "github_id" })
    github: GitHubAccount;

    @OneToMany(
        () => UserRole,
        ur => ur.user,
        { cascade: true }
    )
    userRoles: UserRole[];

    @OneToMany(
        () => UserTech,
        ut => ut.user,
        { cascade: true }
    )
    userTechs: UserTech[];
}