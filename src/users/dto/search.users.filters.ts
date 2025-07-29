import { ArrayMinSize, IsInt, IsOptional, Matches } from "class-validator";
import { IsBirthYear } from "../../utils/decorator/is-birth-year";
import { ApiProperty } from "@nestjs/swagger";
import { IsRange } from "../../utils";
import { Range } from "../../utils/range";
import { Transform } from "class-transformer";

export class SearchUsersFilters {

    @Transform(({ value }) => {

    })
    @Matches(/^(\d+)-(\d+)$/)
    @IsOptional()
    @ApiProperty({ name: "age", type: [Number], minLength: 2, maxLength: 2, required: false })
    birthyear?: Range<number>

    @IsRange()
    @IsInt({ each: true })
    @IsOptional()
    @ApiProperty({ type: [Number], minLength: 2, maxLength: 2, required: false })
    experience?: Range<number>;

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