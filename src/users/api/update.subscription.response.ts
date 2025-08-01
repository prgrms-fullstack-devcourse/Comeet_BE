import { ApiProperty } from "@nestjs/swagger";

export class UpdateSubscriptionResponse {
    @ApiProperty({ type: "integer", description: "구독지 수" })
    nSubscribers: number;

    @ApiProperty({ type: "boolean", description: "구독 여부" })
    subscribing: boolean;
}