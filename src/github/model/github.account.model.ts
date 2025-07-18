import { Column, Entity, PrimaryColumn } from "typeorm";
import { ModelBase } from "../../common";

@Entity("github_accounts")
export class GitHubAccount extends ModelBase {
    @PrimaryColumn({ type: "bigint" })
    id: string;

    @Column({ type: "varchar" })
    username: string;

    @Column({ name: "github_link", type: "varchar" })
    githubLink: string;

    @Column({ name: "n_repos", type: "integer" })
    nRepos: number;

    @Column({ name: "n_stars", type: "integer" })
    nStars: number;

    @Column({ type: "date" })
    since: Date;
}