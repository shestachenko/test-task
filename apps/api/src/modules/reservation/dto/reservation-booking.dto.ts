import {IAmenity, IUser} from '@red/shared';

export class ReservationResultDto {
  reservationId: string;
  user: IUser;
  startTime: string;  // HH:MM format
  duration: number;   // duration in minutes
  amenity: IAmenity;
}

