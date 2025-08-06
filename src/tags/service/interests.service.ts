import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Interest } from "../model/interest.model";
import { Repository } from "typeorm";
import { TypesServiceBase } from "../../common/type";

@Injectable()
export class InterestsService extends TypesServiceBase<Interest>{

    constructor(
       @InjectRepository(Interest)
       protected readonly _repo: Repository<Interest>,
    ) { super(); }

}