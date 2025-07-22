import { Expose, Transform } from "class-transformer";
import { IsDateString, IsNumberString, IsString, IsUrl } from "class-validator";

export class GithubAccountDTO {
    @IsNumberString()
    @Transform(({ value }) => String(value))
    @Expose()
    id: string;

    @IsString()
    @Expose({ name: "login" })
    username: string;

    @IsUrl()
    @Expose({ name: "avatar_url" })
    avatar: string;

    @IsUrl()
    @Expose({ name: "html_url" })
    githubLink: string;

    @Transform(({ value }) => new Date(value))
    @IsDateString()
    @Expose({ name: "created_at" })
    since: Date;
}