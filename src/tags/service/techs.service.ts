import { Injectable } from "@nestjs/common";
import { TagsServiceBase } from "./tags.service.base";
import { InjectRepository } from "@nestjs/typeorm";
import { Tech } from "../model";
import { Repository } from "typeorm";

@Injectable()
export class TechsService extends TagsServiceBase {
    constructor(
        @InjectRepository(Tech)
        repo: Repository<Tech>
    ) { super(repo); }
}