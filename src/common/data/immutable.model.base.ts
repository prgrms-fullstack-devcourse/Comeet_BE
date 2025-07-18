import { CreateDateColumn } from "typeorm";
import { omit } from "../../utils/object";

export abstract class ImmutableModelBase {
    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    static excludeTimestamp<
        M extends ImmutableModelBase
    >(model: M): Omit<M, "createdAt"> {
        const { createdAt, ...rest } = model;
        return rest;
    }

    static excludeWithTimestamp<
        M extends ImmutableModelBase,
        K extends keyof M,
    >(model: M, keys: K[]): Omit<M, "createdAt" | K> {
        return omit(model, ["createdAt",  ...keys]);
    }
}