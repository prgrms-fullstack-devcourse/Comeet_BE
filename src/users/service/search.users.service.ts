import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model";
import { ObjectLiteral, Repository } from "typeorm";
import { SearchUserResult, SearchUsersDTO } from "../dto";
import { pick } from "../../utils/object";
import { TypeBase } from "../../common/data";
import { ageToBirthYear, birthYearToAge } from "./service.internal";
import { PositionsService } from "../../tags/service";

@Injectable()
export class SearchUsersService {

    constructor(
       @InjectRepository(User)
       private readonly _usersRepo: Repository<User>,
    ) {}

    async searchUsers(
        origin: [number, number],
        filters: Omit<SearchUsersDTO, "id">
    ): Promise<SearchUserResult[]> {
        const { radius, age, experience, positionIds, techIds, interestIds } = filters;

        const birthYear = age && age.map(ageToBirthYear)
            .reverse() as [number, number];

        const qb = this._usersRepo
            .createQueryBuilder("user")
            .select("user.*")
            .addSelect(
                "ST_Distance_Sphere(location, ST_Point(:lng, :lat))",
                "distance"
            )
            .setParameters({ lng: origin[0], lat: origin[1] })
            .innerJoinAndSelect("user.position", "position")
            .innerJoinAndSelect("user.userTechs", "userTechs")
            .leftJoinAndSelect("userTechs.tech", "tech")
            .innerJoinAndSelect("user.userInterests", "userInterests")
            .leftJoinAndSelect("userInterests.interest", "interest")
            .where("distance <= :radius", { radius })

        birthYear && qb.andWhere(...__makeRangeCondition("user.birthYear", birthYear));
        experience && qb.andWhere(...__makeRangeCondition("user.experience", experience));
        positionIds?.length && qb.andWhere(...__makeArrayCondition("position.id", positionIds));
        techIds?.length && qb.andWhere(...__makeArrayCondition("userTechs.techId", techIds));
        interestIds?.length && qb.andWhere(...__makeArrayCondition("userInterests.interestId", interestIds));

       const { entities: users, raw } = await qb
           .orderBy("distance", "ASC")
           .getRawAndEntities<{ distance: number;  }>();

       return users.map((user, idx) =>
           __toSearchUserResult(Object.assign(user, pick(raw[idx], ["distance"])))
       );
    }
}

function __makeRangeCondition(
    target: string,
    range: [number, number],
): [string, ObjectLiteral] {
    const [lower, upper] = range;

    if (isNaN(lower))
        return [`${target} <= :upper`, { upper }];
    else if (isNaN(upper))
        return [`${target} >= :lower`, { lower }];
    else
        return [`${target} BETWEEN :lower AND :upper`, { lower, upper }];

}

function __makeArrayCondition(
    target: string,
    array: number[]
): [string, ObjectLiteral] {
    return [`${target} IN (:...array)`, { array }];
}

function __toSearchUserResult(
    data: User & { distance: number },
): SearchUserResult {
    const { birthYear, position, userTechs, userInterests } = data;

    return {
        ...pick(data, ["id", "nickname", "experience", "location", "github", "distance"]),
        age: birthYearToAge(birthYear),
        position: PositionsService.toPositionDTO(position),
        techStack: userTechs.map(ut => TypeBase.toTypeDTO(ut.tech)),
        interests: userInterests.map(ui => TypeBase.toTypeDTO(ui.interest))
    };
}

