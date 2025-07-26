import { MarkBase, ModelBase } from "../data";

export abstract class BookmarkBase<
    Target extends ModelBase
> extends MarkBase {
    abstract target: Target;
}