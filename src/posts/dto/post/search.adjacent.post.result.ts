import { SearchPostResult } from "./search.post.result";
import { GeometricQueryResult } from "../../../common/geo";

export class SearchAdjacentPostResult extends GeometricQueryResult(
    SearchPostResult
) {}