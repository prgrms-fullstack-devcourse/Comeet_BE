import { CreatePostBody } from "../post";
import { IsPair } from "../../../utils";
import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRecruitBody extends CreatePostBody {
    @IsPair()
    @IsNumber({}, { each: true })
    @ApiProperty({
        type: "number",
        isArray: true,
        minLength: 2,
        maxLength: 2,
        required: true
    })
    location: [number, number];
}