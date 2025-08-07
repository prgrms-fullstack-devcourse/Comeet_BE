import { TypeDTO } from "../../common/type";
import { ApiProperty } from "@nestjs/swagger";

export class BoardDTO extends TypeDTO {
    @ApiProperty({ type: "boolean", description: "모집 게시판 여부" })
    isRecruit: boolean;
}