import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../common/geo";
import { PositionDTO } from "../../tags/dto";
import { TypeDTO } from "../../common/type";

@ApiExtraModels(Coordinates, PositionDTO, TypeDTO)
export class UserDTO  {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    nickname: string;

    @ApiProperty({ name: "age", type: "integer" })
    birthyear: number;

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

    @ApiProperty({ type: "integer" })
    nSubscribers: number;

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