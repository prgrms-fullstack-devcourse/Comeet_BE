import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsUrl } from "class-validator";

@ApiSchema()
export class SocialDTO {
    @IsEmail()
    @IsOptional()
    @ApiProperty({ nullable: true })
    email: string | null;

    @IsUrl()
    @IsOptional()
    @ApiProperty({ nullable: true })
    instagram: string | null;

    @IsUrl()
    @IsOptional()
    @ApiProperty({ nullable: true })
    linkedIn: string | null;

    @IsUrl()
    @IsOptional()
    @ApiProperty({ nullable: true })
    blog: string | null;
}