import { ApiProperty } from "@nestjs/swagger";
import { PostDTO } from "../post.dto";

export class RecruitDTO extends PostDTO{




    @ApiProperty({ type: "boolean" })
    applied: boolean;
}