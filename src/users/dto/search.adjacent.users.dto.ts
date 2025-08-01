import { SearchUsersFilters } from "./search.users.filters";
import { ApiProperty } from "@nestjs/swagger";
import { Coordinates } from "../../common/geo";

export class SearchAdjacentUsersDTO extends SearchUsersFilters {
    origin: Coordinates;

    @ApiProperty({ type: "number", required: true })
    radius: number;
}