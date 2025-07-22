import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Interest } from "../model/interest.model";
import { Repository } from "typeorm";
import { TagsServiceBase } from "./tags.service.base";
import { TypeDTO } from "../../common";
import Redis from "iovalkey";

@Injectable()
export class InterestsService extends TagsServiceBase {

    constructor(
        @InjectRepository(Interest)
        repo: Repository<Interest>,
        @Inject(Redis)
        redis: Redis,
    ) {
        super(repo, redis, "interests");
    }

    getAllInterests(): Promise<TypeDTO[]> {
        return this.getAllTags();
    }
}