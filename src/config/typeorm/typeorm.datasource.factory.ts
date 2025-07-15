import { DataSource, DataSourceOptions } from "typeorm";
import { addTransactionalDataSource } from "typeorm-transactional";

export async function typeormDataSourceFactory(options?: DataSourceOptions): Promise<DataSource> {
    if (!options) throw new Error("Invalid options provided");
    return addTransactionalDataSource(new DataSource(options));
}