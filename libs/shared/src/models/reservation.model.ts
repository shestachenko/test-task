export interface ReservationModel {
  id?: string;
  amenityId: string;
  userId: string;
  startTime: number;  // minutes from 00:00 (e.g., 300 = 5:00)
  endTime: number;    // minutes from 00:00 (e.g., 300 = 5:00)
  date: Date | string;
}

export interface CreateReservationDto {
  amenityId: string;
  userId: string;
  startTime: number;
  endTime: number;
  date: Date | string;
}

export interface UpdateReservationDto {
  amenityId?: string;
  userId?: string;
  startTime?: number;
  endTime?: number;
  date?: Date | string;
}
