import { SearchAdjacentUsersDTO } from "../dto";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsRange } from "../../utils";
import { IsOptional } from "class-validator";

export class SearchAdjacentUsersQuery extends OmitType(
    SearchAdjacentUsersDTO, ["id", "origin", "birthyear"]
) {
    @IsRange()
    @IsOptional()
    @ApiProperty({ name: "age", type: "string", pattern: "^(\\d)-(\\d)$", required: false })
    age?: [number, number];
}