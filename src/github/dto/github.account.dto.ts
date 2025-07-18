import { IsDateString, IsNumber, IsString, IsUrl } from "class-validator";
import { Expose, Transform } from "class-transformer";

export class GithubAccountDTO {
    @Transform(({ value }) => String(value))
    @IsNumber()
    @Expose()
    id: string;

    @IsString()
    @Expose({ name: "login" })
    username: string;

    @IsUrl()
    @Expose({ name: "html_url" })
    githubLink: string;

    @IsNumber()
    @Expose({ name: "public_repos" })
    nRepos: number;

    @IsNumber()
    @Expose({ name: "public_gists" })
    nStars: number;

    @Transform(({ value }) => new Date(value))
    @IsDateString()
    @Expose({ name: "created_at" })
    since: Date;
}