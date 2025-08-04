import { ConfigService } from "@nestjs/config";
import Redis from "iovalkey";
import { readFileSync } from "node:fs";


export async function redisFactory(config: ConfigService): Promise<Redis> {
    const ca = config.get<string>("REDIS_TLS_CA");
    const tls = ca ? { ca: readFileSync(ca) } : undefined;

    return new Redis({
        host: config.get<string>("REDIS_HOST")!,
        port: config.get<number>("REDIS_PORT")!,
        db: config.get<number>("REDIS_DB") ?? 0,
        tls
    });
}

