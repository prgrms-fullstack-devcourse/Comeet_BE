import { TypeDTO } from "../../common/type";

export function typesToRecord(types: TypeDTO[]): Record<string, string> {
    return Object.fromEntries(
        types.map(t =>
            [t.id.toString(), t.value]
        )
    );
}

export function recordToTypes(record: Record<string, string>): TypeDTO[] {
    return Object.entries(record)
        .map(([k, v]): TypeDTO =>
            ({ id: Number(k), value: v })
        );
}