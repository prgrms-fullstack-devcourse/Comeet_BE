import { ApiProperty, PickType } from "@nestjs/swagger";
import { UserDTO } from "../../users/dto";


export class SignInResult extends PickType(
    UserDTO, ["nickname", "avatar"]
) {
   @ApiProperty({ type: "string", description: "액세스 토큰" })
   accessToken: string;

   refreshToken: string;
}