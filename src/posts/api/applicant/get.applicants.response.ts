import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { UserBadge } from "../../../users/dto";

@ApiExtraModels(UserBadge)
export class GetApplicantsResponse {
    @ApiProperty({ type: [UserBadge] })
    results: UserBadge[];
}