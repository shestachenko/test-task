export class DayBookingsDto {
  date: string; // YYYY-MM-DD format
  reservations: ReservationInfoDto[];
}

export class ReservationInfoDto {
  reservationId: string;
  startTime: string;  // HH:MM format
  duration: number;   // duration in minutes
  amenityName: string;
}

