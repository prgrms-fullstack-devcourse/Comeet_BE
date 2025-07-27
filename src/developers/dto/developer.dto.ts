import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../utils";
import { IsBirthYear } from "../../utils/decorator/is-birth-year";
import { PositionDTO } from "../../tags/dto";
import { TypeDTO } from "../../common/data";

@ApiExtraModels(Coordinates, PositionDTO, TypeDTO)
export class DeveloperDTO {
    @ApiProperty({ type: "integer" })
    userId: number;

    @ApiProperty({ type: "string" })
    nickname: string;

    @IsBirthYear()
    @ApiProperty({ name: "age", type: "integer" })
    birthYear: number;

    @ApiProperty({ type: "integer", description: "경력" })
    experience: number;

    @ApiProperty({ type: "string",  description: "자기소개" })
    bio: string;

    @ApiProperty({ type: PositionDTO, description: "개발 분야 및 역할" })
    position: PositionDTO;

    @ApiProperty({ type: [TypeDTO], description: "기술스택" })
    techStack: TypeDTO[];

    @ApiProperty({ type: [TypeDTO], description: "관심분야" })
    interests: TypeDTO[];

    @ApiProperty({ type: Coordinates, description: "현재 위치 좌표" })
    location: Coordinates;

    @ApiProperty({ type: "integer", description: "좋아요 수" })
    nLikes: number;

    @ApiProperty({ type: "string" })
    github: string;

    @ApiProperty({ type: "string", nullable: true })
    email: string | null;

    @ApiProperty({ type: "string", nullable: true })
    instagram: string | null;

    @ApiProperty({ type: "string", nullable: true })
    linkedIn: string | null;

    @ApiProperty({ type: "string", nullable: true })
    blog: string | null;
}