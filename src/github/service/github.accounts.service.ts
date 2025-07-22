import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GithubAccount } from "../model";
import { Repository } from "typeorm";
import { GithubAccountDTO } from "../dto";
import { ModelBase } from "../../common";

@Injectable()
export class GitHubAccountsService {

    constructor(
       @InjectRepository(GithubAccount)
       private readonly _accountsRepo: Repository<GithubAccount>,
    ) {}

    async saveGithubAccount(dto: GithubAccountDTO): Promise<void> {
        await this._accountsRepo.save(dto);
    }

    async getGithubAccount(id: string): Promise<GithubAccountDTO> {
        const account = await this._accountsRepo.findOneBy({ id });
        if (!account) throw new ForbiddenException();
        return GitHubAccountsService.toGithubAccountDTO(account);
    }

    static toGithubAccountDTO(account: GithubAccount): GithubAccountDTO {
        return ModelBase.excludeTimestamp(account);
    }
}