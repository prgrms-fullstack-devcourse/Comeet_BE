import { ArrayMinSize, IsInt, IsOptional } from "class-validator";
import { IsBirthYear } from "../../utils/decorator/is-birth-year";
import { ApiProperty } from "@nestjs/swagger";
import { IsRange } from "../../utils";

export class SearchUsersFilters {

    @IsRange()
    @IsBirthYear({ each: true })
    @IsOptional()
    @ApiProperty({ name: "age", type: [Number], minLength: 2, maxLength: 2, required: false })
    birthyear?: [number, number];

    @IsRange()
    @IsInt({ each: true })
    @IsOptional()
    @ApiProperty({ type: [Number], minLength: 2, maxLength: 2, required: false })
    experience?: [number, number];

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