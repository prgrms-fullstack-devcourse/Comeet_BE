import { ConfigService } from "@nestjs/config";
import Redis from "iovalkey";

export async function redisFactory(config: ConfigService): Promise<Redis> {
    return new Redis({
        host: config.get<string>("REDIS_HOST")!,
        port: config.get<number>("REDIS_PORT")!,
        username: config.get<string>("REDIS_USERNAME")!,
        password: config.get<string>("REDIS_PASSWORD")!,
        db: config.get<number>("REDIS_DB") ?? 0,
        tls: config.get("NODE_ENV") === "production"
            ? {} : undefined
    });
}

