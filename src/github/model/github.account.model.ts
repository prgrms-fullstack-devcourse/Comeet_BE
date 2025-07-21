import { Column, Entity, PrimaryColumn } from "typeorm";
import { ModelBase } from "../../common";

@Entity("github_accounts")
export class GithubAccount extends ModelBase {
    @PrimaryColumn({ type: "bigint" })
    id: string;

    @Column({ type: "varchar" })
    username: string;

    @Column({ type: "varchar" })
    avatar: string;

    @Column({ name: "github_link", type: "varchar" })
    githubLink: string;

    @Column({ type: "date" })
    since: Date;
}