
export class RangeObject {
    lower?: number;
    upper?: number;

    static fromRange(range: [number, number]): RangeObject {
        const obj = new RangeObject();
        isNaN(range[0]) || (obj.lower = range[0]);
        isNaN(range[1]) || (obj.upper = range[1]);
        return obj;
    }
}
