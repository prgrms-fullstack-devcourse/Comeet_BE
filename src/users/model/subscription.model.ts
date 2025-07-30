import { MarkBase } from "../../common/marks";
import { Entity } from "typeorm";

@Entity("subscriptions")
export class Subscription extends MarkBase {}