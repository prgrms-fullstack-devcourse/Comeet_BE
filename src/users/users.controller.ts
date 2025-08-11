import {
    Body,
    Controller, Delete,
    Get,
    HttpCode, HttpStatus,
    Inject,
    Param,
    Patch, Put,
    Query,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiBody,
    ApiForbiddenResponse, ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam, ApiQuery, ApiResetContentResponse,
    ApiTags, ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { SearchUsersService, UsersService, SubscriptionsService } from "./service";
import { User } from "../utils";
import { GetUserInterceptor, SearchUsersInterceptor, UserLocationInterceptor } from "./interceptor";
import { SearchAdjacentUserResult, SearchUserResult, UserDTO } from "./dto";
import {
    SearchAdjacentUsersQuery,
    SearchAdjacentUsersResponse,
    SearchUsersResponse,
    UpdateSubscriptionResponse,
    UpdateUserBody
} from "./api";
import { Coordinates } from "../common/geo";
import { RangeObject } from "../utils/range";

@ApiTags("Users")
@Controller('/api/users')
@UseGuards(AuthGuard("jwt"))
export class UsersController {

    constructor(
       @Inject(UsersService)
       private readonly _usersService: UsersService,
       @Inject(SearchUsersService)
       private readonly _searchUsersService: SearchUsersService,
       @Inject(SubscriptionsService)
       private readonly _subsService: SubscriptionsService,
    ) {}

    @Get("/")
    @ApiOperation({ summary: "내 프로필 조회"})
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDTO })
    @ApiForbiddenResponse()
    @UseInterceptors(GetUserInterceptor)
    async getMe(@User("id") id: number): Promise<UserDTO> {
        return this._usersService.getMe(id);
    }

    @Get("/:nickname")
    @ApiOperation({ summary: "다른 사람 프로필 조회" })
    @ApiBearerAuth()
    @ApiParam({ name: "nickname", type: "string", required: true })
    @ApiOkResponse({ type: UserDTO })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    @UseInterceptors(GetUserInterceptor)
    async getOther(
        @Param("nickname") nickname: string,
        @User("id") id: number
    ): Promise<UserDTO> {
        return this._usersService.getOther(nickname, id);
    }

    @Get("/search/near")
    @ApiOperation({ summary: "주위 유저 검색" })
    @ApiBearerAuth()
    @ApiQuery({ type: SearchAdjacentUsersQuery, required: true })
    @ApiOkResponse({ type: SearchAdjacentUsersResponse })
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    @UseInterceptors(UserLocationInterceptor, SearchUsersInterceptor)
    async searchAdjacentUsers(
        @User("id") id: number,
        @User("location")
        origin: Coordinates,
        @Query()
        query: SearchAdjacentUsersQuery,
    ): Promise<SearchAdjacentUserResult[]> {
        const { age, ...rest } = query;

        const birthyear = age && RangeObject.fromRange(
            age.map(x =>
                new Date().getFullYear() - x + 1
            ) as [number, number]
        );

        return this._searchUsersService
            .searchAdjacentUsers({ id, origin, birthyear, ...rest });
    }

    @Get("/search/hot")
    @ApiOperation({ summary: "인기 유저 검색" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: SearchUsersResponse })
    @ApiForbiddenResponse()
    @UseInterceptors(SearchUsersInterceptor)
    async searchHotUsers(): Promise<SearchUserResult[]> {
        return this._searchUsersService
            .searchHotUsers();
    }

    @Get("/search/subscriptions")
    @ApiOperation({ summary: "구독중인 유저 검색" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: SearchUsersResponse })
    @ApiForbiddenResponse()
    @UseInterceptors(SearchUsersInterceptor)
    async searchSubscribingUsers(
        @User("id") id: number,
    ): Promise<SearchUserResult[]> {
        return this._searchUsersService.searchSubscribingUsers(id);
    }


    @Patch("/")
    @ApiOperation({ summary: "유저 정보 수정" })
    @ApiBearerAuth()
    @ApiBody({ type: UpdateUserBody, required: true })
    @ApiResetContentResponse()
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    @HttpCode(HttpStatus.RESET_CONTENT)
    async updateUser(
        @User("id") id: number,
        @Body() body: UpdateUserBody,
    ): Promise<void> {
        await this._usersService.updateUser({ id, ...body });
    }

    @Put("/:nickname/subscriptions")
    @ApiOperation({ summary: "유저 구독상태 반전" })
    @ApiBearerAuth()
    @ApiParam({ name: "nickname", type: "string", required: true })
    @ApiOkResponse({ type: UpdateSubscriptionResponse })
    @ApiForbiddenResponse()
    @ApiNotFoundResponse()
    async updateSubscription(
        @Param("nickname") nickname: string,
        @User("id") id: number,
    ): Promise<UpdateSubscriptionResponse> {
        const [nSubscribers, subscribing]
            = await this._subsService.updateSubscriptions(nickname, id);

        return { nSubscribers, subscribing };
    }

    @Delete("/")
    @ApiOperation({ summary: "회원 탈퇴" })
    @ApiBearerAuth()
    @ApiNoContentResponse()
    @ApiForbiddenResponse()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(
        @User("id") id: number,
    ): Promise<void> {
        await this._usersService.deleteUser(id);
    }


}
