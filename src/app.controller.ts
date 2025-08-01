import { Controller, Get } from '@nestjs/common';

@Controller("/api")
export class AppController {
    @Get("/")
    async checkServer() {
        return "Server is running";
    }
}
