import { SearchUserResult } from "./search.user.result";
import { GeometricQueryResult } from "../../common/geo";

export class SearchAdjacentUserResult
    extends GeometricQueryResult(SearchUserResult) {}