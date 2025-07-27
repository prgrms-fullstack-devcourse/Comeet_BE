import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common/data";
import { Developer } from "../../developers/model";

@Entity("users")
export class User extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "github_id", type: "varchar", unique: true })
    githubId: string;

    @Column({ name: "user_id", type: "integer", unique: true  })
    userId: number;

    @OneToOne(() => Developer, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    developer: Developer;
}