import * as dotenv from 'dotenv'
import path from "path";
dotenv.config({path: `${__dirname}/../.env`})

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3030);
}
bootstrap();
