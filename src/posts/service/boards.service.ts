import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "../model";
import { Repository } from "typeorm";
import { TypesServiceBase } from "../../common/type";

@Injectable()
export class BoardsService extends TypesServiceBase<Board> {
    constructor(
        @InjectRepository(Board)
        protected readonly _repo: Repository<Board>,
    ) { super(); }
}