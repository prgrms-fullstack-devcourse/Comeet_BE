import { SearchUsersFilters } from "./search.users.filters";
import { ApiProperty } from "@nestjs/swagger";

export class SearchAdjacentUsersDTO extends SearchUsersFilters {
    id: number;

    @ApiProperty({ type: "number", required: true })
    radius: number;
}