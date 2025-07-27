import { PickType } from "@nestjs/swagger";
import { DeveloperDTO } from "./developer.dto";

export class SearchDeveloperResult extends PickType(
    DeveloperDTO,
    ["userId", "nickname", "birthYear", "experience", "position", "techStack", "interests"]
) {}