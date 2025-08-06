import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostCount } from "../model/post.count.model";
import { PostCountDTO, UpdatePostCountDTO } from "../dto";
import { pick } from "../../utils";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class PostCountsService {
    constructor(
        @InjectRepository(PostCount)
        private _countsRepo: Repository<PostCount>,
    ) {}

    async getPostCount(postId: number): Promise<PostCountDTO> {
        return this.getPostCountById(postId)
            .then(__toDTO)
            .catch(err => { throw err; });
    }

    @Transactional()
    async updateCount(dto: UpdatePostCountDTO): Promise<PostCountDTO> {
        const { postId, ...rest } = dto;
        await this._countsRepo.update(postId, __makeValues(rest));
        return this.getPostCount(postId);
    }

    private async getPostCountById(postId: number): Promise<PostCount> {
        const count = await this._countsRepo.findOneBy({ id: postId });
        if (!count) throw new NotFoundException();
        return count;
    }
}

function __toDTO(count: PostCount): PostCountDTO {
    return pick(count, ["nLikes", "nComments", "nApplicants"]);
}

function __makeValues(
    dto: Partial<PostCountDTO>
): Record<keyof PostCountDTO, () => string> {
    return Object.fromEntries(
        Object.entries(dto)
            .filter(([_, v]) => !!v)
            .map(([k, v]) =>
                [k, __makeValue(k, v)]
            )
    ) as Record<keyof PostCountDTO, () => string>;
}

function __makeValue(
    prop: string,
    delta: number
): () => string {
    return () =>
        `CASE WHEN ${prop} + ${delta} >= 0 THEN ${prop} +${delta} ELSE ${prop} END`;
}
