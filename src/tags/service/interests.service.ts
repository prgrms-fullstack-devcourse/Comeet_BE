import { Injectable } from "@nestjs/common";
import { SearchTagsServiceBase } from "./search.tags.service.base";
import { InjectRepository } from "@nestjs/typeorm";
import { Interest } from "../model/interest.model";
import { Repository } from "typeorm";

@Injectable()
export class InterestsService extends SearchTagsServiceBase {
    constructor(
        @InjectRepository(Interest)
        repo: Repository<Interest>,
    ) {
        super(repo);
    }
}