import { Injectable } from "@nestjs/common";
import { MarksServiceBase } from "../../common/marks";
import { Bookmark } from "../model";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class BookmarksService extends MarksServiceBase {

    constructor(
        @InjectRepository(Bookmark)
        protected readonly _repo: Repository<Bookmark>,
    ) { super(); }

    async updateBookmark(postId: number, userId: number): Promise<boolean> {
        const delta = await this.updateMark(postId, userId);
        return delta === 1;
    }
}