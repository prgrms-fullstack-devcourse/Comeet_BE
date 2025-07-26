import { TypeBase, TypeDTO } from "../../common/data";
import { Like, Repository } from "typeorm";
import { pick } from "../../utils/object";

export class SearchTagsServiceBase {

    constructor(
       protected readonly _repo: Repository<TypeBase>
    ) {}

    async search(keyword: string): Promise<TypeDTO[]> {

        const tags = await this._repo.findBy({
            value: Like(`%${keyword}%`)
        });

        return tags.map(TypeBase.toTypeDTO);
    }
}