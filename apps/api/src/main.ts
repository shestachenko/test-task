import {Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import session from 'express-session';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  // Security: Helmet for HTTP headers
  app.use(helmet());
  
  // CORS configuration
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are sent
      transform: true, // Automatically transform payloads to DTOs
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  
  // Configure session middleware
  const sessionSecret = process.env.SESSION_SECRET || 'change-this-secret-key-in-production';
  const isProduction = process.env.NODE_ENV === 'production';
  
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction, // set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax', // CSRF protection
      },
      name: 'sessionId', // Don't use default session cookie name
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
