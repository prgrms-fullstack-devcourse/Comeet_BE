import { SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
import { SearchPostsDTO } from "../dto";
import { addWhere } from "../../utils";
import { makeSelectUserBadgeQuery } from "../../users/utils";

export function setSelectClause<M extends object>(
    qb: SelectQueryBuilder<M>
): SelectQueryBuilder<M> {
    return qb
        .select("post.id", "id")
        .addSelect("post.title", "title")
        .addSelect("post.createdAt", "createdAt")
        .innerJoin("post.board", "Board")
        .addSelect(
            "jsonb_build_object('id', Board.id, 'value', Board.value, 'isRecruit', Board.isRecruit)",
            "board"
        )
        .leftJoin("post.user", "user")
        .addSelect(
            makeSelectUserBadgeQuery("user"),
            "author"
        )
        .addSelect("user.nickname", "author")
        .innerJoin("post.count", "count")
        .addSelect("count.nLikes", "nLikes")
        .addSelect("count.nComments", "nComments");
}

export function WhereClause(filters: SearchPostsDTO) {
    return (qb: WhereExpressionBuilder) => {
        const { boardId, userId, keyword } = filters;
        let nWhere = 0;

        if (boardId) {
            const sql = "post.boardId = :boardId";
            nWhere = addWhere(nWhere, qb, sql, { boardId });
        }

        if (userId) {
            const sql = "post.userId = :userId";
            nWhere = addWhere(nWhere, qb, sql, { userId });
        }

        if (keyword) {
            const sql = "post.title LIKE :keyword OR post.content LIKE :keyword";
            addWhere(nWhere, qb, sql, { keyword: `%${keyword}%` });
        }

        return qb;
    }
}




