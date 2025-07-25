import { ApiProperty } from "@nestjs/swagger";

export class PostCategoryQuery {
    @ApiProperty({ type: "string", description: "post | recruit" })
    post
}