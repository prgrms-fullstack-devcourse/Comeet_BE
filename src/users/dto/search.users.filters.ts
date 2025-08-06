import { ArrayMinSize, IsInt, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsRange } from "../../utils";
import { RangeObject } from "../../utils/range";
import { Expose, Transform } from "class-transformer";

export class SearchUsersFilters {

    @Transform(({ value }): RangeObject | undefined =>
        value && RangeObject.fromRange(
            value.map((age: number) =>
                new Date().getFullYear() - age + 1
            ).reverse()
        )
    )
    @IsRange()
    @IsOptional()
    @Expose({ name: "age" })
    @ApiProperty({ name: "age", type: "string", pattern: "^(\\d)-(\\d)$", required: false })
    birthyear?: RangeObject;

    @Transform(({ value }) => RangeObject.fromRange(value))
    @IsInt({ each: true })
    @IsRange()
    @IsOptional()
    @ApiProperty({ type: "string", pattern: "^(\\d)-(\\d)$", required: false })
    experience?: RangeObject;

    @ArrayMinSize(1)
    @IsInt({ each: true })
    @IsOptional()
    @ApiProperty({ type: [Number], minLength: 1, required: false })
    positionIds?: number[];

    @ArrayMinSize(1)
    @IsInt({ each: true })
    @IsOptional()
    @ApiProperty({ type: [Number], minLength: 1, required: false })
    techIds?: number[];

    @ArrayMinSize(1)
    @IsInt({ each: true })
    @IsOptional()
    @ApiProperty({ type: [Number], minLength: 1, required: false })
    interestIds?: number[];
}