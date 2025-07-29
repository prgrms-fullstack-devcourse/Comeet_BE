import { MarkBase } from "../../common/marks";
import { Entity } from "typeorm";

@Entity("user_subscriptions")
export class UserSubscription extends MarkBase {}