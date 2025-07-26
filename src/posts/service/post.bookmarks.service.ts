import { Injectable } from "@nestjs/common";
import { BookmarksServiceBase } from "../../common/bookmarks";
import { Post, PostBookmark } from "../model";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PostBookmarksService extends BookmarksServiceBase<Post> {
    constructor(
        @InjectRepository(PostBookmark)
        protected readonly _repo: Repository<PostBookmark>,
    ) { super(); }
}