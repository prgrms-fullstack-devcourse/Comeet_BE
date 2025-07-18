import { GetUsersDTO } from "./get.users.dto";

export interface GetAdjacentUsersDTO {
    id: number;
    radius: number;
    options?: GetUsersDTO;
}