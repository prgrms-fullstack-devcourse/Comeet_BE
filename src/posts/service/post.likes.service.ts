import { Inject, Injectable } from "@nestjs/common";
import { MarksServiceBase } from "../../common/marks";
import { InjectRepository } from "@nestjs/typeorm";
import { PostLike } from "../model";
import { Repository } from "typeorm";
import { PostCountsService } from "./post.counts.service";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PostLikesService extends MarksServiceBase {

    constructor(
        @InjectRepository(PostLike)
        protected readonly _repo: Repository<PostLike>,
        @Inject(PostCountsService)
        private readonly _countsService: PostCountsService,
    ) { super(); }

    @Transactional()
    async updateLike(postId: number, userId: number): Promise<[number, boolean]> {
        const delta = await this.updateMark(postId, userId);

        const { nLikes } = await this._countsService.updateCount({
            postId, nLikes: delta
        });

        return [nLikes, delta === 1];
    }
}