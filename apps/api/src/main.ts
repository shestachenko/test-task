import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  // Configure session middleware
  app.use(
    session({
      secret: 'your-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  
  Logger.log('\n📋 Available Routes:');
  Logger.log('  GET  /api');
  Logger.log('  POST /api/auth/register (register new user)');
  Logger.log('  POST /api/auth/login (login user) - Creates session');
  Logger.log('  POST /api/auth/logout (logout user) - Destroys session');
  Logger.log('  GET  /api/reservations/by-day?amenityId={id}&date={date}');
  Logger.log('  GET  /api/reservations/by-user?userId={id}');
  Logger.log('  POST /api/csv-parser/parse (with CSV file upload) - Protected');
  Logger.log('');
}

bootstrap();
