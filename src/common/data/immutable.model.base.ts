import { CreateDateColumn } from "typeorm";

/**
 * Base model class for table which does not allow modifying, so doesn't have a updated_at column
 */
export abstract class ImmutableModelBase {
    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;
}