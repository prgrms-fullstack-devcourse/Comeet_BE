import { Injectable } from "@nestjs/common";
import { BookmarkBase } from "./bookmark.base";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class BookmarksService<
    Bookmark extends BookmarkBase<
        BookmarkBase.TargetType<Bookmark>
    >
> {
    private readonly _bookmarksRepo: Repository<Bookmark>;

    constructor(
        ds: DataSource,
        cls: { new (...args: any[]): Bookmark },
    ) {
        this._bookmarksRepo = ds.getRepository(cls);
    }
}