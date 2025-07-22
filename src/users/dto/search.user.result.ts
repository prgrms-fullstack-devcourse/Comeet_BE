import { ApiProperty, PickType } from "@nestjs/swagger";
import { UserDTO } from "./user.dto";

export class SearchUserResult
    extends PickType(
        UserDTO,
        ["id", "nickname", "age", "experience", "position", "techStack", "interests", "location"]
    )
{
    @ApiProperty({ type: "number" })
    distance: number;
}