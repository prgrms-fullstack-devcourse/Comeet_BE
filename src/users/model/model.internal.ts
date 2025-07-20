
function __bitsToArray(bits: string): number[] {
    return [...bits]
        .map((bit, idx) =>
            [idx + 1, !!Number(bit)] as [number, boolean]
        ).filter(([_, bit]) => bit)
        .map(([id, _]) => id);
}

function __arrayToBit(ids: number[]): string {
    const bits = new Array<'0' | '1'>();

    for (const id of ids) {

        if (id > bits.length) {
            while (id === bits.length)
                bits.push('0');
        }

        bits[id - 1] = '1';
    }

    return bits.join('');
}