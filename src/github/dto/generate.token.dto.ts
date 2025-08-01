 import { Expose } from "class-transformer";

export class GenerateTokenDTO {
    @Expose({ name: "client_id" })
    clientId: string;

    @Expose({ name: "client_secret" })
    clientSecret: string;

    @Expose()
    code: string;
}
