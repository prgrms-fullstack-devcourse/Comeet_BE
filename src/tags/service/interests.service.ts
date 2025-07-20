import { Injectable } from "@nestjs/common";
import { TagsServiceBase } from "./tags.service.base";
import { InjectRepository } from "@nestjs/typeorm";
import { Interest } from "../model/interest.model";
import { Repository } from "typeorm";

@Injectable()
export class InterestsService extends TagsServiceBase {
    constructor(
        @InjectRepository(Interest)
        repo: Repository<Interest>,
    ) {
        super(repo);
    }
}