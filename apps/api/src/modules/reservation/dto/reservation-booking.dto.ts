export class ReservationBookingDto {
  reservationId: string;
  userId: number;
  startTime: string;  // HH:MM format
  duration: number;   // duration in minutes
  amenityName: string;
}

