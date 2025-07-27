import { SearchDevelopersDTO } from "./search.developers.dto";

export interface SearchAdjacentDevelopersDTO extends SearchDevelopersDTO {
    userId: number;
    radius: number;
}