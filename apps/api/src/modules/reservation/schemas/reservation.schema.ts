import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {IReservation} from '@red/shared';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({timestamps: true})
export class Reservation implements IReservation {
  @Prop({required: true, type: String})
  amenityId: string;

  @Prop({required: true, type: String})
  userId: string;

  @Prop({required: true})
  startTime: number;  // minutes from 00:00 (e.g., 300 = 5:00)

  @Prop({required: true})
  endTime: number;    // minutes from 00:00 (e.g., 300 = 5:00)

  @Prop({required: true, type: Date})
  date: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
