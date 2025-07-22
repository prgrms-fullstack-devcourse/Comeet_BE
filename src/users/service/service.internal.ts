
export function ageToBirthYear(age: number): number {
    return __currentYear() - age + 1;
}

export function birthYearToAge(birthYear: number): number {
    return __currentYear() - birthYear + 1;
}


function __currentYear(): number {
    return new Date().getFullYear();
}