import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../tags/model";
import { User } from "./user.model";
import { ImmutableModelBase } from "../../common";

@Entity("user_roles")
export class UserRole extends ImmutableModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ name: "role_id", type: "integer" })
    roleId: number;

    @ManyToOne(() => User, { onDelete: "CASCADE", cascade: ["insert", "update"] })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Role, { eager: true })
    @JoinColumn({ name: "role_id" })
    role: Role;
}