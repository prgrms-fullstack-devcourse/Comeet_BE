export class Range<T> {
    lower?: T;
    upper?: T;

    static from<T>(pair: [T, T]): Range<T> {
        const range = new Range<T>();
        range.lower = pair[0];
        range.upper = pair[1];
        return range;
    }
}



