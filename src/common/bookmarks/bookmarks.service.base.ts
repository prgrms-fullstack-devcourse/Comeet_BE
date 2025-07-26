import { ModelBase } from "../data";
import { Repository } from "typeorm";
import { BookmarkBase } from "./bookmark.base";
import { Transactional } from "typeorm-transactional";

export abstract class BookmarksServiceBase<
    Target extends ModelBase
> {
    protected abstract readonly _repo: Repository<BookmarkBase<Target>>;

    @Transactional()
    async updateBookmark(
        targetId: number,
        userId: number
    ): Promise<void> {
        const bookmark = await this._repo.findOneBy({ targetId, userId });

        bookmark
            ? await this._repo.delete(bookmark.id)
            : await this._repo.insert({ targetId, userId });
    }

    async getBookmarked(userId: number): Promise<Target[]> {

        const bookmarks = await this._repo
            .createQueryBuilder("bookmark")
            .select()
            .leftJoinAndSelect("bookmark.target", "target")
            .where("bookmark.userId = :userId", { userId })
            .getMany();

        return bookmarks.map(bm => bm.target);
    }


}