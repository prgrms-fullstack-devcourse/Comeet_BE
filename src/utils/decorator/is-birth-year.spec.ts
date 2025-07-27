import { IsBirthYear } from "./is-birth-year";
import { plainToInstance } from "class-transformer";

class TestSchema {
    @IsBirthYear()
    birthYear: number | [number, number];
}

describe("isBirthYear", () => {


    it("Transform age to birth year for plain to instance case", () => {
        const data = { age: 27 };

        expect(plainToInstance(TestSchema, data))
            .toEqual({ birthYear: 1999 });
    });

    it("Transform each age to birth year for plain to instance case", () => {
        const data = { age: [27, 29] };

        expect(plainToInstance(TestSchema, data))
            .toEqual({ birthYear: [1997, 1999] });
    });
})