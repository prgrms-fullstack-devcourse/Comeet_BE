export interface OAuth2Options {
    tokenURL: string;
    userInfoURL: string;
    clientId: string;
    clientSecret?: string;
    callbackURL: string;
}