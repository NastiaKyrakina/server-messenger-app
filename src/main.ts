import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { RedisIoAdapter } from './adapters/redis.adapter';
import * as express from 'express';
// import { initAdapters } from './adapters.init';
// docker-compose up --build -V
// sudo chmod 666 /var/run/docker.sock
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Messenger')
    .setDescription('The messenger API description')
    .setVersion('1.0')
    .addTag('messenger')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  // initAdapters(app);
  // app.use(join(__dirname, '..', 'resource'));
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  app.use('/', express.static(__dirname + '/../' + 'resource'));
  await app.listen(3000);
}

bootstrap();
