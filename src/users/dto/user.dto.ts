import { ApiExtraModels, ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsNumber, IsString, Min } from "class-validator";
import { IsPair } from "../../utils";
import { SocialDTO } from "./social.dto";
import { TypeDTO } from "../../common";
import { GithubAccountDTO } from "../../github/dto";

@ApiSchema()
@ApiExtraModels(SocialDTO, GithubAccountDTO, TypeDTO)
export class UserDTO {
    @IsNumber()
    @ApiProperty({ type: "integer" })
    id: number;

    @IsString()
    @ApiProperty({ type: "string" })
    nickname: string;

    @IsNumber()
    @Min(0)
    @ApiProperty({ type: "integer" })
    age: number;

    @IsNumber()
    @Min(0)
    @ApiProperty({ type: "integer", description: "경력" })
    experience: number;

    @IsString()
    @ApiProperty({ type: "string", description: "자기소개" })
    bio: string;

    @IsPair()
    @IsNumber({}, { each: true })
    @ApiProperty({
        type: "array",
        items: { type: "integer" },
        minLength: 2,
        maxLength: 2,
        description: "위치 (경도, 위도) 순"
    })
    location: [number, number];

    @ApiProperty({ type: SocialDTO })
    social: SocialDTO;

    @ApiProperty({ type: GithubAccountDTO })
    github: GithubAccountDTO;

    @ApiProperty({ type: TypeDTO, description: "개발 포지션" })
    position: TypeDTO;

    @ApiProperty({ type: [TypeDTO], description: "기술 스택" })
    techStack: TypeDTO[];

    @ApiProperty({ type: [TypeDTO], description: "관심 분야" })
    interests: TypeDTO[];
}