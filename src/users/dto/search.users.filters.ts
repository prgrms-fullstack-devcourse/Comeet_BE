import { ArrayMinSize, IsInt, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsRange } from "../../utils";
import { RangeObject } from "../../utils/range";
import { Transform } from "class-transformer";

export class SearchUsersFilters {
    birthyear?: RangeObject;

    @Transform(({ value }) => value && RangeObject.fromRange(value))
    @IsNumber({}, { each: true })
    @IsRange()
    @IsOptional()
    @ApiProperty({ type: "string", pattern: "^(\\d+),(\\d+)$", required: false })
    experience?: RangeObject;

    @ArrayMinSize(1)
    @IsNumber({}, { each: true })
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