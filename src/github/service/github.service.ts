import { Injectable } from '@nestjs/common';
import { GitHubAccount } from "../model";
import { GithubAccountDTO } from "../dto";
import { ModelBase } from "../../common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GithubService {

    constructor(
        @InjectRepository(GitHubAccount)
        private readonly _accountsRepos: Repository<GitHubAccount>,
    ) {}

    static toGithubAccountDTO(account: GitHubAccount): GithubAccountDTO {
        return ModelBase.excludeTimestamp(account);
    }

    async upsertGithubAccount(dto: GithubAccountDTO): Promise<string> {
        const { id } = await this._accountsRepos.save(dto);
        return id;
    }
}
