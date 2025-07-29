import { Brackets, SelectQueryBuilder } from "typeorm";
import { SearchPostsDTO } from "../dto";

export type SearchPostsFilters = Omit<SearchPostsDTO, "location">;

export function setSelectClause<M extends object>(
    qb: SelectQueryBuilder<M>
): void {
    qb.addSelect("post.id", "id")
        .addSelect("post.title", "title")
        .addSelect("post.createdAt", "createdAt")
        .innerJoin("post.board", "Board")
        .addSelect("Board.value", "board")
        .addSelect("Board.isRecruit", "isRecruit")
        .leftJoin("post.user", "user")
        .addSelect("user.nickname", "author")
        .innerJoin("post.count", "count")
        .addSelect("count.nLikes", "nLikes")
        .addSelect("count.nComments", "nComments");
}

export function setWhereClause<M extends object>(
    qb: SelectQueryBuilder<M>,
    filters: SearchPostsFilters,
): void {
    const { boardId, userId, keyword } = filters;

    boardId && qb.andWhere("post.boardId = :boardId", { boardId });
    userId && qb.andWhere("post.userId = :userId", { userId });

    if (keyword) {
        qb.andWhere(new Brackets(qb =>
            qb.where("post.title LIKE :keyword", { keyword: `%${keyword}%` })
                .orWhere("post.content LIKE :keyword", { keyword: `%${keyword}%` })
        ));
    }
}



