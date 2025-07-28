import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post, Bookmark, PostLike } from "../model";
import { Repository } from "typeorm";
import { CreatePostDTO, PostDTO, UpdatePostDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import { setSelectClause } from "./service.internal";
import { SelectExists } from "../../common/marks";
import { ApplicantsService } from "./applicants.service";

@Injectable()
export class PostsService {

    constructor(
       @InjectRepository(Post)
       private readonly _postsRepo: Repository<Post>,
       @Inject(ApplicantsService)
       private readonly _applicantsService: ApplicantsService,
    ) {}

    @Transactional()
    async createPost(dto: CreatePostDTO): Promise<void> {
        await this._postsRepo.save(dto);
    }

    async getPost(id: number, userId: number): Promise<PostDTO> {
        const qb = this._postsRepo.createQueryBuilder("post");
        setSelectClause(qb);

        const post = await qb
            .addSelect("post.content", "content")
            .addSelect(
                "jsonb_build_object('lat', ST_Y(post.location), 'lng', ST_X(post.location))",
                "location"
            )
            .addSelect("post.userId = :userId", "editable")
            .addSelect(SelectExists(PostLike), "likeIt")
            .addSelect(SelectExists(Bookmark), "bookmark")
            .addSelect("NULL", "applied")
            .where("id = :id")
            .setParameters({ id, userId })
            .getRawOne<PostDTO>();

        if (!post) throw new NotFoundException();

        if (post.isRecruit)
            post.applied = await this._applicantsService.didMark(id, userId);

        return post;
    }

    @Transactional()
    async updatePost(dto: UpdatePostDTO): Promise<void> {
        const { id, userId, ...values } = dto;
        const { affected } = await this._postsRepo.update({ id, userId }, values);

        if (affected) {

            const { board: { isRecruit } } = await this._postsRepo.findOneOrFail({
                relations: { board: true },
                select: { board: { isRecruit: true } }
            });

            if (!isRecruit && values.location) throw new ConflictException();
        }
    }

    @Transactional()
    async deletePost(id: number, userId: number): Promise<void> {
        await this._postsRepo.delete({ id, userId });
    }
}

