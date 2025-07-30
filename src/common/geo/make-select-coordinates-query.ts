
export function makeSelectCoordinatesQuery(
    tableAlias: string,
    prop: string,
): string {
    const tg = tableAlias + '.' + prop;

    return `jsonb_build_object(
    'lat', ST_Y(${tg}), 
    'lng', ST_X(${tg})
    )`;
}