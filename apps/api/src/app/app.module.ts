import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ReservationModule} from '../modules/reservation/reservation.module';
import {AmenityModule} from '../modules/amenity/amenity.module';
import {CsvParserModule} from '../modules/csv-parser/csv-parser.module';
import {databaseConfig} from '../config/database.config';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri, databaseConfig.options),
    AmenityModule,
    ReservationModule,
    CsvParserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
