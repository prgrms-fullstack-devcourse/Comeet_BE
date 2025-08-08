import { IntersectionType } from "@nestjs/swagger";
import { UserBadge } from "../../users/dto";
import { TokenPair } from "./token.pair";

export class SignInResult extends IntersectionType(
   UserBadge, TokenPair
) {}