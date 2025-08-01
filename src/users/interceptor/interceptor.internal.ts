
export function transformBirthyearToAge<
    T extends { birthyear: number }
>(data: T): Omit<T, "birthyear"> & { age: number; } {
    const { birthyear, ...rest } = data;
    const age = new Date().getFullYear() - birthyear + 1;
    return Object.assign(rest, { age });
}