import { ModelBase } from "./model.base";
import { Column, PrimaryGeneratedColumn } from "typeorm";

/**
 * Base model for table having four columns: id, value + timestamp columns,
 * Such tables describe type or kind
 * (.e.g tech stack, development field)
 */
export abstract class TypeBase extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", unique: true })
    value: string;
}