import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GeoPostPointer, Post } from "../model";
import { Repository } from "typeorm";
import { LikesService } from "../../likes";
import { CreatePostDTO, PostDTO, UpdatePostDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import { ModelDTOTransformerService } from "./model.dto.transformer.service";

@Injectable()
export class PostsService {

    constructor(
       @InjectRepository(Post)
       private readonly _postsRepo: Repository<Post>,
       @InjectRepository(GeoPostPointer)
       private readonly _pointersRepo: Repository<GeoPostPointer>,
       @Inject(LikesService)
       private readonly _likesService: LikesService,
       @Inject(ModelDTOTransformerService)
       private readonly _transformerService: ModelDTOTransformerService,
    ) {}

    @Transactional()
    async createPost(dto: CreatePostDTO): Promise<void> {
        const { location, ...values } = dto;
        const post = await this.insertAndSelect(values);

        if (post.category.isRecruit) {
            await this._pointersRepo.insert({
                postId: post.id,
                location: location ?? post.user!.location
            });
        }

        await this._postsRepo.update(post.id, {
            isRecruit: post.category.isRecruit
        });
    }

    async getPost(id: number, userId: number): Promise<PostDTO> {

        const post = await this._postsRepo.findOne({
            relations: { category: true, user: true },
            where: { id }
        });

        if (!post) throw new NotFoundException();
        return this._transformerService.toPostDTO(post, userId);
    }

    @Transactional()
    async updatePost(dto: UpdatePostDTO): Promise<void> {
        const { id, userId, location, ...values } = dto;
        const post = await this._postsRepo.findOneBy({ id, userId });

        if (post) {
            await this._postsRepo.update({ id, userId }, values);

            if (post.isRecruit && location)
                await this._pointersRepo.update(id, { location });
        }
    }

    updateLike(id: number, userId: number): Promise<number> {
        return this._likesService.updateLike({
            targetType: "post",
            targetId: id,
            userId
        });
    }

    @Transactional()
    async deletePost(id: number, userId: number): Promise<void> {
        const { affected } = await this._postsRepo.delete({ id, userId });

        affected && await this._likesService.onTargetDeleted({
            targetType: "post",
            targetId: id,
        });
    }

    @Transactional()
    private async insertAndSelect(
        values: Omit<CreatePostDTO, "location">
    ): Promise<Post> {

        const id: number = await this._postsRepo.insert(values)
            .then(result => result.identifiers[0].id)
            .catch(err => { throw  err; });

        return this._postsRepo.findOneOrFail({
            relations: { category: true, user: true },
            where: { id }
        });
    }
}

