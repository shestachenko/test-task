import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Reservation, ReservationDocument} from '../schemas/reservation.schema';

@Injectable()
export class ReservationRepository {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>
  ) {}

  async findByAmenityAndDate(amenityId: string, date: Date): Promise<ReservationDocument[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.reservationModel
      .find({
        amenityId,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .sort({startTime: 1})
      .exec();
  }

  async findByUserId(userId: string): Promise<ReservationDocument[]> {
    return this.reservationModel
      .find({userId})
      .sort({date: 1, startTime: 1})
      .exec();
  }
}
