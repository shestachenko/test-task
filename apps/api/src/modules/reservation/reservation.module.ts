import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ReservationController} from './controllers/reservation.controller';
import {ReservationService} from './services/reservation.service';
import {ReservationRepository} from './repositories/reservation.repository';
import {Reservation, ReservationSchema} from './schemas/reservation.schema';
import {AmenityModule} from '../amenity/amenity.module';
import {UserModule} from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Reservation.name, schema: ReservationSchema}]),
    AmenityModule,
    UserModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository],
  exports: [ReservationService],
})
export class ReservationModule {}
