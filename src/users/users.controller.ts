import { Body, Controller, Get, Inject, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./service";
import { UserDTO } from "./dto";
import { User } from "../utils";
import { UpdateUserBody } from "./api";
import {
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResetContentResponse,
    ApiTags, ApiUnprocessableEntityResponse
} from "@nestjs/swagger";

@ApiTags("Users")
@Controller("/api/users/me")
@UseGuards(AuthGuard("jwt"))
export class UsersController {

    constructor(
       @Inject(UsersService)
       private readonly _usersService: UsersService,
    ) {}

    @Get("/")
    @ApiOperation({ summary: "프로필 조회" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDTO })
    @ApiForbiddenResponse()
    async getUser(
        @User("id") id: number,
    ): Promise<UserDTO> {
        return await this._usersService.getUser({ id });
    }

    @Patch("/")
    @ApiBearerAuth()
    @ApiBody({ type: UpdateUserBody, required: true })
    @ApiResetContentResponse()
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse()
    async updateUser(
        @User("id") id: number,
        @Body() body: UpdateUserBody,
    ): Promise<void> {
        await this._usersService.updateUser({
            id, ...body
        });
    }
}
