import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateBoardBody } from "./create.board.body";

export class UpdateBoardBody extends PartialType(
    OmitType(CreateBoardBody, ["categoryId"])
) {}