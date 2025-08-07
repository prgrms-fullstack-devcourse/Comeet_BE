import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { UserBadge } from "../../../common/badge";

@ApiExtraModels(UserBadge)
export class GetApplicantsResponse {
    @ApiProperty({ type: [UserBadge] })
    results: UserBadge[];
}