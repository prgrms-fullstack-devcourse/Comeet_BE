import { Inject, Injectable } from "@nestjs/common";
import { MarksServiceBase } from "../../common/marks";
import { InjectRepository } from "@nestjs/typeorm";
import { PostLike } from "../model";
import { Repository } from "typeorm";
import { PostCountsService } from "./post.counts.service";

@Injectable()
export class PostLikesService extends MarksServiceBase {

    constructor(
        @InjectRepository(PostLike)
        protected readonly _repo: Repository<PostLike>,
        @Inject(PostCountsService)
        private readonly _countsService: PostCountsService,
    ) { super(); }

    async updateLike(userId: number, postId: number): Promise<number> {
        const delta = await this.updateMark(userId, postId);

        const { nLikes } = await this._countsService.updateCount({
            postId, nLikes: delta
        });

        return nLikes;
    }
}