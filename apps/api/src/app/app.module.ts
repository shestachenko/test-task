import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ThrottlerModule, ThrottlerGuard} from '@nestjs/throttler';
import {APP_GUARD} from '@nestjs/core';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ReservationModule} from '../modules/reservation/reservation.module';
import {AmenityModule} from '../modules/amenity/amenity.module';
import {CsvParserModule} from '../modules/csv-parser/csv-parser.module';
import {UserModule} from '../modules/user/user.module';
import {databaseConfig} from '../config/database.config';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri, databaseConfig.options),
    // Rate limiting: 100 requests per 15 minutes per IP
    ThrottlerModule.forRoot([{
      ttl: 900000, // 15 minutes
      limit: 100,
    }]),
    AmenityModule,
    ReservationModule,
    CsvParserModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
