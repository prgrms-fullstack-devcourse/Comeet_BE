import { IntersectionType } from "@nestjs/swagger";
import { UserBadge } from "../../common/badge";
import { TokenPair } from "./token.pair";

export class SignInResult extends IntersectionType(
   UserBadge, TokenPair
) {}