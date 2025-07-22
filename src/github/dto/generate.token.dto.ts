import { Expose } from "class-transformer";

interface IGenerateTokenDTO {
    clientId: string;
    clientSecret: string;
    code?: string;
    refreshToken?: string;
}

export class GenerateTokenDTO {
    @Expose({ name: "client_id" })
    clientId: string;

    @Expose({ name: "client_secret" })
    clientSecret: string;

    @Expose()
    code?: string;

    @Expose({ name: "refresh_token"})
    refreshToken?: string;

    @Expose({ name: "grant_type" })
    grantType: "code" | "refresh_token";

    constructor(data: IGenerateTokenDTO) {
        Object.assign(this, data);
        this.grantType = this.refreshToken ? "refresh_token" : "code";
    }
}