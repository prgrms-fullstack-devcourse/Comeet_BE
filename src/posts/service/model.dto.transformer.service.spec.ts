import { Test, TestingModule } from '@nestjs/testing';
import { ModelDTOTransformerService } from './model.dto.transformer.service';
import { LikesService } from '../../likes';
import { CommentsService } from './comments.service';
import { ApplicantsService } from './applicants.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeoPostPointer, Post } from '../model';
import { Repository } from 'typeorm';
import { faker } from "@faker-js/faker";

function makePost(init?: Partial<Post>): Post {

    const post: Post = {
        id: Math.floor(Math.random() * 10),
        title: faker.book.title(),
        content: faker.word.words(5),
        board: { value: faker.book.genre() },
        userId: faker.number.int(),
        user: { nickname: faker.internet.username() },
        isRecruit: faker.number.int() % 2 === 0,
        createdAt: new Date(),
    } as Post;

    return init ? Object.assign(post, init) : post;
}

describe('ModelDTOTransformerService', () => {
    let service: ModelDTOTransformerService;
    let likesService: LikesService;
    let commentsService: CommentsService;
    let applicantsService: ApplicantsService;
    let pointersRepo: Repository<GeoPostPointer>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ModelDTOTransformerService,
                {
                    provide: LikesService,
                    useValue: {
                        didLikeIt: jest.fn().mockResolvedValue(true),
                        countLikes: jest.fn().mockResolvedValue(10),
                    },
                },
                {
                    provide: CommentsService,
                    useValue: {
                        countComments: jest.fn().mockResolvedValue(5),
                    },
                },
                {
                    provide: ApplicantsService,
                    useValue: {
                        didApplyToIt: jest.fn().mockResolvedValue(true),
                    },
                },
                {
                    provide: getRepositoryToken(GeoPostPointer),
                    useValue: {
                        findOneBy: jest.fn().mockResolvedValue({ location: { lat: 0, lon: 0 } }),
                    },
                },
            ],
        }).compile();

        service = module.get<ModelDTOTransformerService>(ModelDTOTransformerService);
        likesService = module.get<LikesService>(LikesService);
        commentsService = module.get<CommentsService>(CommentsService);
        applicantsService = module.get<ApplicantsService>(ApplicantsService);
        pointersRepo = module.get<Repository<GeoPostPointer>>(getRepositoryToken(GeoPostPointer));
    });

    it('should transform Post to PostDTO', async () => {
        const post: Post = {
            id: 1,
            title: 'Sample Post',
            content: 'Hello world',
            createdAt: new Date(),
            board: { value: 'Tech' },
            userId: 123,
            user: { nickname: 'User123' },
            isRecruit: true,
        } as Post;

        const result = await service.toPostDTO(post, 123);

        expect(result).toMatchObject({
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            category: 'Tech',
            author: 'User123',
            nLikes: 10,
            nComments: null,
            editable: true,
            likeIt: true,
            applied: true,
            location: null
        });
    });
});