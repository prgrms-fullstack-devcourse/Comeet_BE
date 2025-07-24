import { ApiProperty } from "@nestjs/swagger";
import { PostBaseDTO } from "../post.base.dto";

export class RecruitDTO extends PostBaseDTO{

    @ApiProperty({
        type: "number",
        isArray: true,
        minLength: 2,
        maxLength: 2
    })
    location: [number, number];


    @ApiProperty({ type: "boolean" })
    applied: boolean;
}