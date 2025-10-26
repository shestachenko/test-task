/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  
  Logger.log('\n📋 Available Routes:');
  Logger.log('  GET  /api');
  Logger.log('  GET  /api/reservations/by-day?amenityId={id}&date={date}');
  Logger.log('  GET  /api/reservations/by-user?userId={id}');
  Logger.log('');
}

bootstrap();
