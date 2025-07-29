import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { ApplicantDTO } from "../../dto";

@ApiExtraModels(ApplicantDTO)
export class GetApplicantsResponse {
    @ApiProperty({ type: [ApplicantDTO] })
    results: ApplicantDTO[];
}