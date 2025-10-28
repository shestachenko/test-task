import {IBaseModel} from './base.model.interface';
import {IUser} from './user.interface';
import {IAmenity} from './amenity.interface';

export interface IReservation extends IBaseModel {
  amenityId: string;
  userId: string;
  startTime: number;  // minutes from 00:00 (e.g., 300 = 5:00)
  endTime: number;    // minutes from 00:00 (e.g., 300 = 5:00)
  date: Date | string;
}

export interface IReservationResultDto {
  reservationId: string;
  user: IUser | null;
  startTime: string;  // HH:MM format
  duration: number;   // duration in minutes
  amenity: IAmenity;
}

export interface IReservationInfoDto {
  reservationId: string;
  startTime: string;  // HH:MM format
  duration: number;   // duration in minutes
  amenity: IAmenity | null;
}

export interface IDayBookingsDto {
  date: string;  // YYYY-MM-DD format
  reservations: IReservationInfoDto[];
}

