import { Injectable } from "@nestjs/common";
import { MarksServiceBase } from "../../common/marks";
import { PostBookmark } from "../model";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PostBookmarksService extends MarksServiceBase {
    constructor(
        @InjectRepository(PostBookmark)
        protected readonly _repo: Repository<PostBookmark>,
    ) { super(); }
}