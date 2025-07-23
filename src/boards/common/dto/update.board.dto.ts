import { CreateBoardDTO } from "./create.board.dto";

export type UpdateBoardDTO<
    T extends CreateBoardDTO = CreateBoardDTO
> = { id: number; } & Partial<Omit<T, "categoryId">>;