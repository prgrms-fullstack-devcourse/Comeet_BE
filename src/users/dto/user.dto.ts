import { TypeDTO } from "../../common/data";
import { PositionDTO } from "../../tags/dto";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../utils";

@ApiExtraModels(PositionDTO, TypeDTO, Coordinates)
export class UserDTO {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string" })
    nickname: string;

    @ApiProperty({ type: "integer" })
    age: number;

    @ApiProperty({ type: "integer" })
    experience: number;

    @ApiProperty({ type: "string" })
    bio: string;

    @ApiProperty({ type: Coordinates })
    location: Coordinates;

    @ApiProperty({ type: PositionDTO })
    position: PositionDTO;

    @ApiProperty({ type: [TypeDTO] })
    techStack: TypeDTO[];

    @ApiProperty({ type: [TypeDTO] })
    interests: TypeDTO[];

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