import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { omit } from "../../utils/object";

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

    static excludeWithTimestamp<
        M extends ModelBase,
        K extends keyof M,
    >(model: M, keys: K[]): Omit<M, "createdAt" | "updatedAt" | K> {
        return omit(model, ["createdAt", "updatedAt", ...keys]);
    }
}

