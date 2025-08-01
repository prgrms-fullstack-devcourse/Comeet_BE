import { Controller, Get, Inject, Query } from "@nestjs/common";
import { UsersService } from "./service";
import { AvailableNicknameQuery, AvailableNicknameResponse } from "./api";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("Users", "Validation")
@Controller("/api/users/validation")
export class UserValidationController {

    constructor(
       @Inject(UsersService)
       private readonly _usersService: UsersService,
    ) {}

    @Get()
    @ApiOperation({ summary: "닉네임 사용가능 여부 확인" })
    @ApiQuery({ type: AvailableNicknameQuery, required: true })
    @ApiOkResponse({ type: AvailableNicknameResponse })
    async availableNickname(
        @Query("nickname")
        nickname: string,
    ): Promise<AvailableNicknameResponse> {
        const available = !await this._usersService.existsByNickname(nickname);
        return { available };
    }
}