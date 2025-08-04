 import { Expose } from "class-transformer";

export class GenerateTokenDTO {
    @Expose({ name: "client_id" })
    clientId: string;

    @Expose({ name: "client_secret" })
    clientSecret: string;

    @Expose({ name: "redirect_uri" })
    callbackURL: string;

    @Expose()
    code: string;
}
