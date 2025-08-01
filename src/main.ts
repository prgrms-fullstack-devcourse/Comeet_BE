import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from "typeorm-transactional";
import { NestExpressApplication } from "@nestjs/platform-express";
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { LoggingInterceptor } from "./common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import passport from "passport";
import * as process from "node:process";

async function bootstrap() {
  initializeTransactionalContext();

  const app
      = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set("trust_proxy", true);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  }));

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(passport.initialize());

  SwaggerModule.setup(
      "api-docs", app,
      SwaggerModule.createDocument(
          app,
          new DocumentBuilder()
              .setTitle('Comeet API Docs')
              .setVersion('1.0.0')
              .build()
      )
  );

  await app.listen(
      process.env.PORT ?? 3000,
      process.env.HOST ?? "127.0.0.1"
  );
}
bootstrap();
