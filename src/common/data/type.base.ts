import { ModelBase } from "./model.base";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class TypeBase extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", unique: true })
    value: string;
}