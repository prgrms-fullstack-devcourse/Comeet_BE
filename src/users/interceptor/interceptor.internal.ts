
export function transformBirthyearToAge<
    T extends { birthyear: number }
>(data: T): Omit<T, "birthyear"> & { age: number; } {
    const { birthyear, ...rest } = data;
    const age = new Date().getFullYear() - birthyear + 1;
    return Object.assign(rest, { age });
}

export function transformAgeToBirthyear<
    T extends { age: number }
>(data: T): Omit<T, "age"> & { birthyear: number; } {
    const { age, ...rest } = data;
    const birthyear = new Date().getFullYear() - age + 1;
    return Object.assign(rest, { birthyear });
}

