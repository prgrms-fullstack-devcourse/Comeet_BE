import { MarkBase, ModelBase } from "../data";

export abstract class BookmarkBase<
    TargetT extends ModelBase
> extends MarkBase {
    /**
     * entity referenced by targetId
     */
    abstract target: TargetT;
}

export namespace BookmarkBase {
    export type TargetType<B extends BookmarkBase<any>>
        = B extends BookmarkBase<infer T> ? T : never;
}