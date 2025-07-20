import { Injectable } from "@nestjs/common";
import { SearchTagsServiceBase } from "./search.tags.service.base";
import { InjectRepository } from "@nestjs/typeorm";
import { Tech } from "../model";
import { Repository } from "typeorm";

@Injectable()
export class TechsService extends SearchTagsServiceBase {
    constructor(
        @InjectRepository(Tech)
        repo: Repository<Tech>
    ) { super(repo); }
}