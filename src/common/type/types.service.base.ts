import { TypeBase } from "./type.base";
import { TypeDTO } from "./type.dto";
import { Repository, SelectQueryBuilder } from "typeorm";

export abstract class TypesServiceBase<M extends TypeBase> {
    protected abstract readonly _repo: Repository<M>;

    async getAll(): Promise<TypeDTO[]> {
        return this.createSelectQueryBuilder()
            .cache(true)
            .getRawMany<TypeDTO>();
    }

    async getByIds(ids: number[]): Promise<TypeDTO[]> {
        return this.createSelectQueryBuilder()
            .whereInIds(ids)
            .cache(true)
            .getRawMany<TypeDTO>();
    }

    protected createSelectQueryBuilder(): SelectQueryBuilder<M> {
        return this._repo.createQueryBuilder("type")
            .select("type.id", "id")
            .addSelect("type.value", "value");
    }
}