import { SearchPostsDTO } from "./search.posts.dto";
import {  OmitType } from "@nestjs/swagger";
import { GeometricQuery } from "../../../common/geo";

export class SearchAdjacentPostsDTO extends GeometricQuery(
    OmitType(SearchPostsDTO, ["userId"])
) {}