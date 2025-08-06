import { SearchUsersFilters } from "./search.users.filters";
import { GeometricQuery } from "../../common/geo";

export class SearchAdjacentUsersDTO
    extends GeometricQuery(SearchUsersFilters)
{
    id: number;
}