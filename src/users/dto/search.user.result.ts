import { UserDTO } from "./user.dto";
import { ApiExtraModels, ApiProperty, PickType } from "@nestjs/swagger";
import { PositionDTO } from "../../tags/dto";
import { TypeDTO } from "../../common/data";

@ApiExtraModels(PositionDTO, TypeDTO)
export class SearchUserResult extends PickType(
    UserDTO,
    ["id", "nickname", "age", "experience", "position", "techStack", "interests", "github"]
) {
    @ApiProperty({ type: "number" })
    distance: number;
}