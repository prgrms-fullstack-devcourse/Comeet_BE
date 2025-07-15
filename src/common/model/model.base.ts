import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class ModelBase {
    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;

    static excludeTimestamp<
        M extends ModelBase
    >(model: M): Omit<M, "createdAt" | "updatedAt"> {
        const { createdAt, updatedAt, ...rest } = model;
        return rest;
    }
}

