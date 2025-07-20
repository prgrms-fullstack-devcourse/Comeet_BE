import { TypeBase, TypeDTO } from "../../common";
import { In, Like, Repository } from "typeorm";
import { pick } from "../../utils/object";
import { BadRequestException } from "@nestjs/common";

export class TagsServiceBase {

    constructor(
       protected readonly _repo: Repository<TypeBase>
    ) {}

    async getTags(tagIds: number[]): Promise<TypeDTO[]> {

        const tags = await this._repo.find({
            where: { id: In(tagIds) },
            cache: true
        });

        if (tags.length !== tagIds.length)
            throw new BadRequestException();

        return tags.map(__toDTO);
    }

    async search(keyword: string): Promise<TypeDTO[]> {

        const tags = await this._repo.findBy({
            value: Like(`%${keyword}%`)
        });

        return tags.map(__toDTO);
    }
}

function __toDTO(tag: TypeBase): TypeDTO {
    return pick(tag, ["id", "value"]);
}