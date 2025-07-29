import { Range } from "./range";
import { ObjectLiteral } from "typeorm";

export function makeRangeCondition<T>(
    alias: string,
    prop: string,
    range: Range<T>
): [string, ObjectLiteral] {
    const tg = alias + '.' + prop;
    let sql: string;

    if (range.lower === undefined)
        sql = `${tg} <= :upper`;
    else if (range.upper === undefined)
        sql = `${tg} >= :lower`;
    else
        sql = `${tg} BETWEEN :lower AND :upper`;

    return [sql, range];
}