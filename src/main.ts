import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureSwagger(app);
  await app.listen(3000);
}

async function configureSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Weather Service')
    .setDescription('This service collects data from the Open Weather API')
    .setVersion('1.0')
    .addTag('weather')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
}

bootstrap();
