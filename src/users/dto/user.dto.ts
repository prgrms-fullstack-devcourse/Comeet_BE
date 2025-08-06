import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../common/geo";
import { PositionDTO } from "../../tags/dto";
import { TypeDTO } from "../../common/type";
import { Transform, Type } from "class-transformer";
import { recordToTypes } from "../internal";

@ApiExtraModels(Coordinates, PositionDTO, TypeDTO)
export class UserDTO  {
    @ApiProperty({ type: "string" })
    nickname: string;

    @ApiProperty({ type: "string", description: "깃허브 프로필 이미지 url" })
    avatar: string;

    @ApiProperty({ name: "age", type: "integer" })
    birthyear: number;

    @ApiProperty({ type: "integer", description: "경력" })
    experience: number;

    @ApiProperty({ type: "string",  description: "자기소개" })
    bio: string;

    @Type(() => PositionDTO)
    @ApiProperty({ type: PositionDTO, description: "개발 분야 및 역할" })
    position: PositionDTO;

    @Transform(({ value }) => recordToTypes(value))
    @ApiProperty({ type: [TypeDTO], description: "기술스택" })
    techStack: TypeDTO[];

    @Transform(({ value }) => recordToTypes(value))
    @ApiProperty({ type: [TypeDTO], description: "관심분야" })
    interests: TypeDTO[];

    @Type(() => Coordinates)
    @ApiProperty({ type: Coordinates, description: "현재 위치 좌표" })
    location: Coordinates;

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

    @ApiProperty({ type: "integer", description: "구독지 수" })
    nSubscribers: number;

    @ApiProperty({ type: "boolean", nullable: true, description: "구독 여부" })
    subscribing: boolean | null;
}