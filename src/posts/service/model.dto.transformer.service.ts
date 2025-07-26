import { Inject, Injectable } from "@nestjs/common";
import { LikesService } from "../../likes";
import { CommentsService } from "./comments.service";
import { ApplicantsService } from "./applicants.service";
import { InjectRepository } from "@nestjs/typeorm";
import { GeoPostPointer, Post } from "../model";
import { Repository } from "typeorm";
import { Coordinates } from "../../utils";
import { PostDTO, SearchPostResult } from "../dto";
import { pick } from "../../utils/object";
import { CommentsCountService } from "./comments.count.service";

@Injectable()
export class ModelDTOTransformerService {

    constructor(
       @Inject(LikesService)
       private readonly _likesService: LikesService,
       @Inject(CommentsService)
       private readonly _commentsService: CommentsService,
       @Inject(ApplicantsService)
       private readonly _applicantsService: ApplicantsService,
       @InjectRepository(GeoPostPointer)
       private readonly _pointersRepo: Repository<GeoPostPointer>,
    ) {}

    async toPostDTO(post: Post, userId: number): Promise<PostDTO> {

        const likeIt = await this._likesService.didLikeIt({
            targetType: "post",
            targetId: post.id,
            userId
        });

        const applied = post.isRecruit
            ? await this._applicantsService.didApplyToIt(post.id, userId)
            : null;

        return {
            ...await this.toSearchPostResult(post),
            content: post.content,
            editable: post.userId === userId,
            likeIt, applied
        }
    }

    async toSearchPostResult(
        post: Post,
        loc?: Coordinates
    ): Promise<SearchPostResult> {
        const category = post.category.value;
        const author = post.user?.nickname ?? "알수없음";

        const nLikes = await this._likesService.countLikes({
            targetType: "post",
            targetId: post.id,
        });

        const nComments = post.isRecruit
            ? null : await this._commentsService.countComments(post.id);

        const location = !loc && post.isRecruit
            ? await this._pointersRepo.findOneBy({ postId: post.id })
                .then(ptr => ptr && ptr.location)
                .catch(err => { throw err; })
            : null;

        return {
            ...pick(post, ["id", "title", "createdAt"]),
            location, category, author, nLikes, nComments
        };
    }

}