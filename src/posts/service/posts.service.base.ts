import { Repository } from "typeorm";
import { PostBase } from "../model/post.base";
import { PostBaseDTO, SearchPostBaseResult } from "../dto";
import { LikesService } from "../../likes";
import { LikeDTO, TargetDTO } from "../../likes/dto";
import { pick } from "../../utils/object";
import { Transactional } from "typeorm-transactional";

export abstract class PostsServiceBase<
    P extends PostBaseDTO,
    K extends PostBaseDTO.MutableKeys<P>
> {
    protected abstract readonly _repo: Repository<PostBase>;
    protected abstract readonly _likesService: LikesService;
    protected abstract readonly _postType: string;

    abstract getPost(id: number, userId: number): Promise<PostBaseDTO>;

    abstract searchPosts(
        dto: PostBaseDTO.SearchDTO
    ): Promise<SearchPostBaseResult[]>;

    async createPost(
        dto: PostBaseDTO.CreateDTO<P, K>
    ): Promise<void> {
        const { title, content, ...rest } = dto;

        await this._repo.save({
            ...rest,
            common: { title, content },
        });
    }

    async updatePost(
        dto: PostBaseDTO.UpdateDTO<P, K>
    ): Promise<void> {
        const { id, userId, title, content, ...rest } = dto;
        const values = { ...rest, common: { title, content } };
        await this._repo.update({ id, userId }, values);
    }

    updatePostLike(id: number, userId: number): Promise<number> {
        return this._likesService.updateLike(
            this.makeLike(id, userId)
        );
    }

    @Transactional()
    async deletePost(id: number, userId: number): Promise<boolean> {
        const { affected } = await this._repo.delete({ id, userId });

        affected && await this._likesService
            .onTargetDeleted(this.makeTarget(id));

        return !!affected;
    }

    protected async toDTO(post: PostBase, userId: number): Promise<PostBaseDTO> {
        const category = post.category.value;
        const author = post.user?.nickname ?? "알수없음";
        const editable = post.userId === userId;

        const [nLikes, likeIt] = await this._likesService
            .countAndCheckLike(this.makeLike(post.id, userId));

        return {
            ...pick(post, ["id", "createdAt"]),
            ...pick(post.common, ["title", "content"]),
            category, author, editable, nLikes, likeIt
        };
    }

    protected async toSearchResult(post: PostBase): Promise<SearchPostBaseResult> {
        return {
            ...pick(post, ["id", "createdAt"]),
            category: post.category.value,
            author: post.user?.nickname ?? "알수없음",
            title: post.common.title,
            nLikes: await this._likesService.countLikes(this.makeTarget(post.id))
        };
    }

    protected makeLike(id: number, userId: number): LikeDTO {
        return { ...this.makeTarget(id), userId };
    }

    protected makeTarget(id: number): TargetDTO {
        return { targetType: this._postType, targetId: id };
    }
}