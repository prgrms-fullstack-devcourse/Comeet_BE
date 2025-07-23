import { PickType } from "@nestjs/swagger";
import { BoardDTO } from "./board.dto";

export class SearchBoardResult extends PickType(
    BoardDTO,
    ["id", "category", "author", "title", "createdAt", "nLikes"]
) {}
