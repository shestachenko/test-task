export interface ReservationModel {
  id?: string;
  amenityId: number;
  userId: number;
  startTime: number;  // minutes from 00:00 (e.g., 300 = 5:00)
  endTime: number;    // minutes from 00:00 (e.g., 300 = 5:00)
  date: Date | string;
}

export interface CreateReservationDto {
  amenityId: number;
  userId: number;
  startTime: number;
  endTime: number;
  date: Date | string;
}

export interface UpdateReservationDto {
  amenityId?: number;
  userId?: number;
  startTime?: number;
  endTime?: number;
  date?: Date | string;
}
