import { ageToBirthYear, birthYearToAge } from "./service.internal";

describe("service.internal", () => {
    it("ageToBirthYear", () => {
        expect(ageToBirthYear(27)).toBe(1999);
    })

    it('birthYearToAge', () => {
        expect(birthYearToAge(1999)).toBe(27);
    });
})