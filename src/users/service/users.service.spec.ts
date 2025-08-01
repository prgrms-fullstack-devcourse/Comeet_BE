import { UsersService } from "./users.service";
import { InterestsService, PositionsService, TechsService } from "../../tags";
import { SubscriptionsService } from "./subscriptions.service";
import { Test, TestingModule } from "@nestjs/testing";

jest.mock("typeorm-transactional", () => ({
    Transactional: jest.fn()
}))

describe("UsersService", () => {
    let service: UsersService;
    let positionsService: PositionsService;
    let techsService: TechsService;
    let interestsService: InterestsService;
    let subsService: SubscriptionsService;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            imports: [

            ]
        }).compile()

    });

    describe("createUser", () => {

    });

})