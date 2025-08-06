import { IsNumberString, IsUrl } from "class-validator";
import { Expose, Transform } from "class-transformer";

export class GithubUserDTO {
    @IsNumberString()
    @Transform(({ value }) => String(value))
    @Expose({ name: "id" })
    githubId: string;

    @IsUrl()
    @Expose({ name: "avatar_url" })
    avatar: string;

    @IsUrl()
    @Expose({ name: "html_url" })
    github: string;
}